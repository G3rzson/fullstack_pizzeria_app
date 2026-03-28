"use server";

import { errorLogger } from "@/shared/Functions/errorLogger";
import {
  ACCESS_TOKEN_MAX_AGE,
  LOGIN_INFO,
  REFRESH_TOKEN_MAX_AGE,
} from "../_constants/info";
import { loginSchema } from "../_validation/loginSchema";
import { handleResponse } from "@/shared/Functions/handleResponse";
import { getUserByUsername } from "../_dal/loginDal";
import bcrypt from "bcrypt";
import {
  getJwtSecrets,
  signRefreshToken,
  signAccessToken,
  buildAuthCookieOptions,
} from "@/shared/Functions/jwt";
import { cookies } from "next/headers";

export async function loginAction(formData: unknown) {
  try {
    const result = await loginSchema.safeParseAsync(formData);
    if (!result.success) {
      await errorLogger(result.error, "loginAction - validation error");
      return handleResponse(false, LOGIN_INFO.validationError);
    }

    const userData = await getUserByUsername(result.data.username);
    if (!userData) {
      return handleResponse(false, LOGIN_INFO.userNotExist);
    }

    const isPasswordValid = await bcrypt.compare(
      result.data.password,
      userData.password,
    );
    if (!isPasswordValid) {
      return handleResponse(false, LOGIN_INFO.userNotExist);
    }

    const jwtSecrets = getJwtSecrets();
    if (!jwtSecrets) {
      await errorLogger(
        new Error("JWT secrets are not defined"),
        "loginAction - JWT secrets error",
      );
      return handleResponse(false, LOGIN_INFO.serverError);
    }

    const tokenPayload = {
      id: userData.id,
      username: userData.username,
      role: userData.role,
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

    cookieStore.set("access_token", accessToken, {
      ...buildAuthCookieOptions(ACCESS_TOKEN_MAX_AGE),
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });

    cookieStore.set("refresh_token", refreshToken, {
      ...buildAuthCookieOptions(REFRESH_TOKEN_MAX_AGE),
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });

    return handleResponse(true, LOGIN_INFO.success);
  } catch (error) {
    await errorLogger(error, "loginAction - server error");
    return handleResponse(false, LOGIN_INFO.serverError);
  }
}
