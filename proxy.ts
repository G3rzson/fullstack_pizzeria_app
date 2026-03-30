import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAccessToken, getJwtSecrets } from "@/shared/Functions/jwt";

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
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Access token lekérése és ellenőrzése
  const accessToken = request.cookies.get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const decodedToken = verifyAccessToken(
    accessToken,
    jwtSecrets.accessTokenSecret,
  );

  if (!decodedToken) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
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
