"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  getJwtSecrets,
  verifyAccessToken,
  verifyRefreshToken,
  type AuthTokenPayload,
  signAccessToken,
  ACCESS_TOKEN_MAX_AGE,
  buildAuthCookieOptions,
} from "./jwt";

export async function requireAuth(nextPath: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  const jwtSecrets = getJwtSecrets();
  if (!jwtSecrets) {
    redirect("/user/login");
  }

  const accessPayload = accessToken
    ? verifyAccessToken(accessToken, jwtSecrets.accessTokenSecret)
    : null;

  if (accessPayload) {
    return accessPayload;
  }

  const refreshPayload = refreshToken
    ? verifyRefreshToken(refreshToken, jwtSecrets.refreshTokenSecret)
    : null;

  if (!refreshPayload) {
    redirect("/user/login");
  }

  // Generate new access token and set cookie
  const newAccessToken = signAccessToken(
    refreshPayload,
    jwtSecrets.accessTokenSecret,
  );

  cookieStore.set(
    "access_token",
    newAccessToken,
    buildAuthCookieOptions(ACCESS_TOKEN_MAX_AGE),
  );

  return refreshPayload;
}

export async function getAuthUser(): Promise<AuthTokenPayload | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return null;
  }

  const jwtSecrets = getJwtSecrets();
  if (!jwtSecrets) {
    return null;
  }

  // Only verify access token, do NOT attempt to refresh
  // (can't modify cookies in Server Components, only in Server Actions/Route Handlers)
  const payload = verifyAccessToken(accessToken, jwtSecrets.accessTokenSecret);

  return payload;
}
