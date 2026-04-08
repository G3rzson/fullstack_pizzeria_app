import {
  buildAuthCookieOptions,
  getJwtSecrets,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "@/lib/auth/jwt";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getUserByUsername } from "../login/_dal/loginDal";
import {
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
} from "../login/_constants/info";

/**
 * Shared refresh logic used by both POST and GET handlers
 */
async function refreshTokens() {
  const cookieStore = await cookies();

  const refreshToken = cookieStore.get("refresh_token")?.value;
  if (!refreshToken) {
    return { success: false, error: "No refresh token", status: 401 };
  }

  const jwtSecrets = getJwtSecrets();
  if (!jwtSecrets) {
    return { success: false, error: "JWT secrets missing", status: 500 };
  }

  const verifiedToken = verifyRefreshToken(
    refreshToken,
    jwtSecrets.refreshTokenSecret,
  );
  if (!verifiedToken) {
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");
    return { success: false, error: "Invalid token", status: 401 };
  }

  const username = verifiedToken.username;

  const userData = await getUserByUsername(username);
  if (!userData) {
    return { success: false, error: "User not found", status: 401 };
  }

  const tokenPayload = {
    id: userData.id,
    username: userData.username,
    role: userData.role,
  };

  const newAccessToken = signAccessToken(
    tokenPayload,
    jwtSecrets.accessTokenSecret,
  );
  const newRefreshToken = signRefreshToken(
    tokenPayload,
    jwtSecrets.refreshTokenSecret,
  );

  cookieStore.set("access_token", newAccessToken, {
    ...buildAuthCookieOptions(ACCESS_TOKEN_MAX_AGE),
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });

  cookieStore.set("refresh_token", newRefreshToken, {
    ...buildAuthCookieOptions(REFRESH_TOKEN_MAX_AGE),
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });

  return {
    success: true,
    user: {
      id: userData.id,
      username: userData.username,
      role: userData.role,
    },
  };
}

/**
 * POST /auth/refresh
 * Client-side API endpoint - returns JSON
 * Used by fetchWrapper for API calls
 */
export async function POST(request: Request) {
  const result = await refreshTokens();

  if (!result.success) {
    return NextResponse.json(
      { user: null, error: result.error },
      { status: result.status },
    );
  }

  return NextResponse.json({ user: result.user });
}

/**
 * GET /auth/refresh?returnTo=/path
 * Server-side redirect endpoint - returns redirect
 * Used by middleware for protected routes
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const returnTo = searchParams.get("returnTo") || "/";

  const result = await refreshTokens();

  if (!result.success) {
    // Refresh failed - redirect to login
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", returnTo);
    return NextResponse.redirect(loginUrl);
  }

  // Refresh success - redirect back to original page
  return NextResponse.redirect(new URL(returnTo, request.url));
}
