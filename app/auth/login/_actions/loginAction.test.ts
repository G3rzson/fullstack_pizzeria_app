import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";

vi.mock("bcrypt", () => ({
  default: {
    compare: vi.fn(),
  },
}));

vi.mock("../_dal/loginDal", () => ({
  getUserByUsername: vi.fn(),
}));

vi.mock("@/shared/Functions/errorLogger", () => ({
  errorLogger: vi.fn(),
}));

vi.mock("@/shared/Functions/isDev", () => ({
  default: vi.fn(),
}));

vi.mock("@/lib/auth/jwt", () => ({
  getJwtSecrets: vi.fn(),
  signAccessToken: vi.fn(),
  signRefreshToken: vi.fn(),
  buildAuthCookieOptions: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("@/shared/Functions/handleResponse", () => ({
  handleResponse: vi.fn((success: boolean, message: string) => ({
    success,
    message,
  })),
}));

import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import {
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
} from "../_constants/info";
import { getUserByUsername } from "../_dal/loginDal";
import {
  buildAuthCookieOptions,
  getJwtSecrets,
  signAccessToken,
  signRefreshToken,
} from "@/lib/auth/jwt";
import { handleResponse } from "@/shared/Functions/handleResponse";
import { errorLogger } from "@/shared/Functions/errorLogger";
import isDev from "@/shared/Functions/isDev";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";
import { loginAction } from "./loginAction";

const mockBcryptCompare = bcrypt.compare as unknown as Mock;
const mockGetUserByUsername = getUserByUsername as unknown as Mock;
const mockGetJwtSecrets = getJwtSecrets as unknown as Mock;
const mockSignAccessToken = signAccessToken as unknown as Mock;
const mockSignRefreshToken = signRefreshToken as unknown as Mock;
const mockBuildAuthCookieOptions = buildAuthCookieOptions as unknown as Mock;
const mockCookies = cookies as unknown as Mock;
const mockHandleResponse = handleResponse as unknown as Mock;
const mockErrorLogger = errorLogger as unknown as Mock;
const mockIsDev = isDev as unknown as Mock;

describe("loginAction action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsDev.mockReturnValue(true);
    mockBuildAuthCookieOptions.mockReturnValue({
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });
  });

  it("returns validation error for invalid input", async () => {
    const result = await loginAction({ username: "", password: "" });

    expect(result).toEqual({
      success: false,
      message: BACKEND_RESPONSE_MESSAGES.INVALID_DATA,
    });
    expect(mockHandleResponse).toHaveBeenCalledWith(
      false,
      BACKEND_RESPONSE_MESSAGES.INVALID_DATA,
    );
    expect(mockGetUserByUsername).not.toHaveBeenCalled();
    expect(mockBcryptCompare).not.toHaveBeenCalled();
    expect(mockGetJwtSecrets).not.toHaveBeenCalled();
  });

  it("returns not found when user does not exist", async () => {
    mockGetUserByUsername.mockResolvedValue(null);

    const result = await loginAction({
      username: "nonexistent",
      password: "Password123",
    });

    expect(result).toEqual({
      success: false,
      message: BACKEND_RESPONSE_MESSAGES.NOT_FOUND,
    });
    expect(mockGetUserByUsername).toHaveBeenCalledWith("nonexistent");
    expect(mockBcryptCompare).not.toHaveBeenCalled();
  });

  it("returns not found when password is invalid", async () => {
    mockGetUserByUsername.mockResolvedValue({
      id: "user-1",
      username: "tester",
      password: "hashed_password",
      role: "USER",
    });
    mockBcryptCompare.mockResolvedValue(false);

    const result = await loginAction({
      username: "tester",
      password: "WrongPassword1",
    });

    expect(result).toEqual({
      success: false,
      message: BACKEND_RESPONSE_MESSAGES.NOT_FOUND,
    });
    expect(mockBcryptCompare).toHaveBeenCalledWith(
      "WrongPassword1",
      "hashed_password",
    );
    expect(mockGetJwtSecrets).not.toHaveBeenCalled();
  });

  it("returns server error when jwt secrets are missing", async () => {
    mockGetUserByUsername.mockResolvedValue({
      id: "user-1",
      username: "tester",
      password: "hashed_password",
      role: "USER",
    });
    mockBcryptCompare.mockResolvedValue(true);
    mockGetJwtSecrets.mockReturnValue(null);

    const result = await loginAction({
      username: "tester",
      password: "Password123",
    });

    expect(result).toEqual({
      success: false,
      message: BACKEND_RESPONSE_MESSAGES.SERVER_ERROR,
    });
    expect(mockGetJwtSecrets).toHaveBeenCalled();
  });

  it("logs in successfully and sets access and refresh cookies", async () => {
    const cookieStore = { set: vi.fn() };

    mockGetUserByUsername.mockResolvedValue({
      id: "user-1",
      username: "tester",
      password: "hashed_password",
      role: "USER",
    });
    mockBcryptCompare.mockResolvedValue(true);
    mockGetJwtSecrets.mockReturnValue({
      accessTokenSecret: "access-secret",
      refreshTokenSecret: "refresh-secret",
    });
    mockSignAccessToken.mockReturnValue("access-token");
    mockSignRefreshToken.mockReturnValue("refresh-token");
    mockCookies.mockResolvedValue(cookieStore);

    const result = await loginAction({
      username: "tester",
      password: "Password123",
    });

    expect(mockSignAccessToken).toHaveBeenCalledWith(
      {
        id: "user-1",
        username: "tester",
        role: "USER",
      },
      "access-secret",
    );
    expect(mockSignRefreshToken).toHaveBeenCalledWith(
      {
        id: "user-1",
        username: "tester",
        role: "USER",
      },
      "refresh-secret",
    );
    expect(mockBuildAuthCookieOptions).toHaveBeenNthCalledWith(
      1,
      ACCESS_TOKEN_MAX_AGE,
    );
    expect(mockBuildAuthCookieOptions).toHaveBeenNthCalledWith(
      2,
      REFRESH_TOKEN_MAX_AGE,
    );
    expect(cookieStore.set).toHaveBeenCalledWith(
      "access_token",
      "access-token",
      expect.objectContaining({
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: ACCESS_TOKEN_MAX_AGE,
      }),
    );
    expect(cookieStore.set).toHaveBeenCalledWith(
      "refresh_token",
      "refresh-token",
      expect.objectContaining({
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: REFRESH_TOKEN_MAX_AGE,
      }),
    );
    expect(result).toEqual({
      success: true,
      message: BACKEND_RESPONSE_MESSAGES.SUCCESS,
    });
  });

  it("logs with errorLogger in dev mode and returns server error", async () => {
    const error = new Error("db down");
    mockGetUserByUsername.mockRejectedValue(error);
    mockIsDev.mockReturnValue(true);

    const result = await loginAction({
      username: "tester",
      password: "Password123",
    });

    expect(mockErrorLogger).toHaveBeenCalledWith(
      error,
      "server error - loginAction",
    );
    expect(result).toEqual({
      success: false,
      message: BACKEND_RESPONSE_MESSAGES.SERVER_ERROR,
    });
  });

  it("logs with console.error in non-dev mode and returns server error", async () => {
    const error = new Error("db down");
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockGetUserByUsername.mockRejectedValue(error);
    mockIsDev.mockReturnValue(false);

    const result = await loginAction({
      username: "tester",
      password: "Password123",
    });

    expect(mockErrorLogger).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith("Error logging in:", error);
    expect(result).toEqual({
      success: false,
      message: BACKEND_RESPONSE_MESSAGES.SERVER_ERROR,
    });

    consoleSpy.mockRestore();
  });
});
