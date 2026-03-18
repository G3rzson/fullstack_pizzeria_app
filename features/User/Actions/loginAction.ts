"use server";
import {
  ACCESS_TOKEN_MAX_AGE,
  buildAuthCookieOptions,
  getJwtSecrets,
  REFRESH_TOKEN_MAX_AGE,
  signAccessToken,
  signRefreshToken,
} from "@/shared/auth/jwt";
import { getUserByUsername } from "../Dal/userDal";
import { LoginFormType, loginSchema } from "../Validation/loginShema";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

export async function loginAction(loginData: LoginFormType) {
  const { data, success } = await loginSchema.safeParseAsync(loginData);

  if (!success) {
    return {
      success: false,
      message: "Hibás adatok! Kérem ellenőrizze a megadott információkat.",
    };
  }

  try {
    const userData = await getUserByUsername(data.username);
    if (!userData) {
      return { success: false, message: "Invalid username or password" };
    }

    const isPasswordValid = await bcrypt.compare(
      data.password,
      userData.password,
    );
    if (!isPasswordValid) {
      return { success: false, message: "Invalid username or password" };
    }

    const jwtSecrets = getJwtSecrets();
    if (!jwtSecrets) {
      console.error("JWT secrets are missing from environment variables");
      return {
        success: false,
        message: "Server configuration error. Please try again later.",
      };
    }

    const tokenPayload = {
      sub: userData.id,
      username: userData.username,
    };

    const accessToken = signAccessToken(
      tokenPayload,
      jwtSecrets.accessTokenSecret,
    );
    const refreshToken = signRefreshToken(
      tokenPayload,
      jwtSecrets.refreshTokenSecret,
    );

    const cookieStore = await cookies();

    cookieStore.set(
      "access_token",
      accessToken,
      buildAuthCookieOptions(ACCESS_TOKEN_MAX_AGE),
    );

    cookieStore.set(
      "refresh_token",
      refreshToken,
      buildAuthCookieOptions(REFRESH_TOKEN_MAX_AGE),
    );

    return {
      success: true,
      message: "Sikeres bejelentkezés!",
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "Szerverhiba történt! Próbáld újra később.",
    };
  }
}
