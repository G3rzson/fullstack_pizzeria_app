import jwt, { type JwtPayload } from "jsonwebtoken";

export const ACCESS_TOKEN_EXPIRES_IN = "3m";
export const REFRESH_TOKEN_EXPIRES_IN = "1d";

export const ACCESS_TOKEN_MAX_AGE = 60 * 3;
export const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24;

export type AuthTokenPayload = {
  sub: string;
  username: string;
};

type JwtSecrets = {
  accessTokenSecret: string;
  refreshTokenSecret: string;
};

export function getJwtSecrets(): JwtSecrets | null {
  const accessTokenSecret = process.env.JWT_ACCESS_SECRET;
  const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;

  if (!accessTokenSecret || !refreshTokenSecret) {
    return null;
  }

  return { accessTokenSecret, refreshTokenSecret };
}

export function buildAuthCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge,
  };
}

export function signAccessToken(payload: AuthTokenPayload, secret: string) {
  return jwt.sign(payload, secret, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
}

export function signRefreshToken(payload: AuthTokenPayload, secret: string) {
  return jwt.sign(payload, secret, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
}

function toAuthPayload(payload: string | JwtPayload): AuthTokenPayload | null {
  if (typeof payload === "string") {
    return null;
  }

  if (typeof payload.sub !== "string" || typeof payload.username !== "string") {
    return null;
  }

  return {
    sub: payload.sub,
    username: payload.username,
  };
}

export function verifyAccessToken(token: string, secret: string) {
  try {
    const payload = jwt.verify(token, secret);
    return toAuthPayload(payload);
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string, secret: string) {
  try {
    const payload = jwt.verify(token, secret);
    return toAuthPayload(payload);
  } catch {
    return null;
  }
}
