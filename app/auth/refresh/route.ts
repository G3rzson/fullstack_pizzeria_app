import {
  buildAuthCookieOptions,
  getJwtSecrets,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "@/shared/Functions/jwt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getUserByUsername } from "../login/_dal/loginDal";
import {
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
} from "../login/_constants/info";

export async function POST(request: Request) {
  const cookieStore = await cookies();

  const refreshToken = cookieStore.get("refresh_token")?.value;
  if (!refreshToken) {
    return NextResponse.json(
      { user: null, error: "No refresh token" },
      { status: 401 },
    );
  }

  const jwtSecrets = getJwtSecrets();
  if (!jwtSecrets) {
    return NextResponse.json(
      { user: null, error: "JWT secrets missing" },
      { status: 500 },
    );
  }

  const verifiedToken = verifyRefreshToken(
    refreshToken,
    jwtSecrets.refreshTokenSecret,
  );
  if (!verifiedToken) {
    const response = NextResponse.json(
      { user: null, error: "Invalid token" },
      { status: 401 },
    );
    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");
    return response;
  }

  const username = verifiedToken.username;

  const userData = await getUserByUsername(username);
  if (!userData) {
    return NextResponse.json(
      { user: null, error: "User not found" },
      { status: 401 },
    );
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

  return NextResponse.json({
    user: {
      id: userData.id,
      username: userData.username,
      role: userData.role,
    },
  });
}
