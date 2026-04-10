"use server";

import { errorLogger } from "@/shared/Functions/errorLogger";
import {
  ACCESS_TOKEN_MAX_AGE,
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
} from "@/lib/auth/jwt";
import { cookies } from "next/headers";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";
import isDev from "@/shared/Functions/isDev";

export async function loginAction(formData: unknown) {
  try {
    const result = await loginSchema.safeParseAsync(formData);
    if (!result.success)
      return handleResponse(false, BACKEND_RESPONSE_MESSAGES.INVALID_DATA);

    const userData = await getUserByUsername(result.data.username);
    if (!userData)
      return handleResponse(false, BACKEND_RESPONSE_MESSAGES.NOT_FOUND);

    const isPasswordValid = await bcrypt.compare(
      result.data.password,
      userData.password,
    );
    if (!isPasswordValid)
      return handleResponse(false, BACKEND_RESPONSE_MESSAGES.NOT_FOUND);

    const jwtSecrets = getJwtSecrets();
    if (!jwtSecrets)
      return handleResponse(false, BACKEND_RESPONSE_MESSAGES.SERVER_ERROR);

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

    return handleResponse(true, BACKEND_RESPONSE_MESSAGES.SUCCESS);
  } catch (error) {
    isDev()
      ? errorLogger(error, "server error - loginAction")
      : console.error("Error logging in:", error);
    return handleResponse(false, BACKEND_RESPONSE_MESSAGES.SERVER_ERROR);
  }
}
