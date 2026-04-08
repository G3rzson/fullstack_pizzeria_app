import {
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
} from "@/app/auth/login/_constants/info";
import jwt, { type JwtPayload } from "jsonwebtoken";

export type AuthTokenPayload = {
  id: string;
  username: string;
  role: "USER" | "ADMIN";
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

  if (
    typeof payload.id !== "string" ||
    typeof payload.username !== "string" ||
    (payload.role !== "USER" && payload.role !== "ADMIN")
  ) {
    return null;
  }

  return {
    id: payload.id,
    username: payload.username,
    role: payload.role,
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
