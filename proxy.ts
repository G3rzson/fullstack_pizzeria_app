import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAccessToken, getJwtSecrets } from "@/lib/auth/jwt";

// Védett route-ok, amikhez ADMIN role kell
const ADMIN_PROTECTED_ROUTES = ["/dashboard"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ellenőrizzük, hogy a kért útvonal védett-e
  const isAdminProtectedRoute = ADMIN_PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  if (!isAdminProtectedRoute) {
    return NextResponse.next();
  }

  // JWT secrets ellenőrzése
  const jwtSecrets = getJwtSecrets();
  if (!jwtSecrets) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Access token lekérése és ellenőrzése
  const accessToken = request.cookies.get("access_token")?.value;

  if (!accessToken) {
    // Nincs access token - próbáljunk refresh-elni
    const refreshToken = request.cookies.get("refresh_token")?.value;

    if (refreshToken) {
      // Van refresh token, irányítsunk a refresh endpoint-ra
      const refreshUrl = new URL("/auth/refresh", request.url);
      refreshUrl.searchParams.set("returnTo", pathname);
      return NextResponse.redirect(refreshUrl);
    }

    // Nincs refresh token sem - login
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const decodedToken = verifyAccessToken(
    accessToken,
    jwtSecrets.accessTokenSecret,
  );

  if (!decodedToken) {
    // Érvénytelen access token - próbáljunk refresh-elni
    const refreshToken = request.cookies.get("refresh_token")?.value;

    if (refreshToken) {
      // Van refresh token, irányítsunk a refresh endpoint-ra
      const refreshUrl = new URL("/auth/refresh", request.url);
      refreshUrl.searchParams.set("returnTo", pathname);
      return NextResponse.redirect(refreshUrl);
    }

    // Nincs refresh token - login
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("access_token");
    return response;
  }

  // ADMIN role ellenőrzése
  if (decodedToken.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
