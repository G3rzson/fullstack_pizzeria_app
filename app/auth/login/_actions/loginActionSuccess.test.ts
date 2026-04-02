import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { loginAction } from "./loginAction";
import { LOGIN_INFO } from "../_constants/info";

// Mock bcrypt
vi.mock("bcrypt", () => ({
  default: {
    compare: vi.fn(),
  },
}));

// Mock loginDal
vi.mock("../_dal/loginDal", () => ({
  getUserByUsername: vi.fn(),
}));

// Mock errorLogger
vi.mock("@/shared/Functions/errorLogger", () => ({
  errorLogger: vi.fn(),
}));

// Mock jwt functions
vi.mock("@/shared/Functions/jwt", () => ({
  getJwtSecrets: vi.fn(),
  signAccessToken: vi.fn(),
  signRefreshToken: vi.fn(),
  buildAuthCookieOptions: vi.fn(),
}));

// Mock next cookies
vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

// Mock handleResponse
vi.mock("@/shared/Functions/handleResponse", () => ({
  handleResponse: vi.fn((success: boolean, message: string) => ({
    success,
    message,
  })),
}));

// Importok a mock után
import bcrypt from "bcrypt";
import { getUserByUsername } from "../_dal/loginDal";
import {
  getJwtSecrets,
  signAccessToken,
  signRefreshToken,
  buildAuthCookieOptions,
} from "@/shared/Functions/jwt";
import { cookies } from "next/headers";
import { handleResponse } from "@/shared/Functions/handleResponse";

// típusok a mockokhoz
const mockBcryptCompare = bcrypt.compare as Mock;
const mockGetUserByUsername = getUserByUsername as Mock;
const mockGetJwtSecrets = getJwtSecrets as Mock;
const mockSignAccessToken = signAccessToken as Mock;
const mockSignRefreshToken = signRefreshToken as Mock;
const mockBuildAuthCookieOptions = buildAuthCookieOptions as Mock;
const mockCookies = cookies as Mock;
const mockHandleResponse = handleResponse as Mock;

describe("loginAction - success scenarios", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully log in a user with valid credentials", async () => {
    const mockData = {
      username: "TestUser",
      password: "Password123",
    };

    mockGetUserByUsername.mockResolvedValue({
      id: "user-uuid",
      username: "TestUser",
      password: "hashed_password_123",
      role: "user",
    });

    mockBcryptCompare.mockResolvedValue(true);

    mockGetJwtSecrets.mockReturnValue({
      accessTokenSecret: "access_secret",
      refreshTokenSecret: "refresh_secret",
    });
    mockSignAccessToken.mockReturnValue("access_token");
    mockSignRefreshToken.mockReturnValue("refresh_token");
    const mockCookieStore = {
      set: vi.fn(),
    };
    mockCookies.mockResolvedValue(mockCookieStore);
    mockBuildAuthCookieOptions.mockReturnValue({
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });

    const result = await loginAction(mockData);
    expect(result.success).toBe(true);
    expect(result.message).toBe(LOGIN_INFO.success);
    expect(mockGetUserByUsername).toHaveBeenCalledWith("TestUser");
    expect(mockBcryptCompare).toHaveBeenCalledWith(
      "Password123",
      "hashed_password_123",
    );
    expect(mockGetJwtSecrets).toHaveBeenCalled();
    expect(mockSignAccessToken).toHaveBeenCalledWith(
      {
        id: "user-uuid",
        username: "TestUser",
        role: "user",
      },
      "access_secret",
    );
    expect(mockSignRefreshToken).toHaveBeenCalledWith(
      {
        id: "user-uuid",
        username: "TestUser",
        role: "user",
      },
      "refresh_secret",
    );
    expect(mockCookieStore.set).toHaveBeenCalledWith(
      "access_token",
      "access_token",
      expect.objectContaining({
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: expect.any(Number),
      }),
    );
    expect(mockCookieStore.set).toHaveBeenCalledWith(
      "refresh_token",
      "refresh_token",
      expect.objectContaining({
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: expect.any(Number),
      }),
    );
    expect(mockHandleResponse).toHaveBeenCalledWith(true, LOGIN_INFO.success);
  });
});
