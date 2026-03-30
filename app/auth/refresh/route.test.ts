import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { POST } from "./route";
import { cookies } from "next/headers";
import {
  getJwtSecrets,
  verifyRefreshToken,
  signAccessToken,
  signRefreshToken,
  buildAuthCookieOptions,
} from "@/shared/Functions/jwt";
import { getUserByUsername } from "../login/_dal/loginDal";

// Mock next/headers
vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

// Mock jwt functions
vi.mock("@/shared/Functions/jwt", () => ({
  getJwtSecrets: vi.fn(),
  verifyRefreshToken: vi.fn(),
  signAccessToken: vi.fn(),
  signRefreshToken: vi.fn(),
  buildAuthCookieOptions: vi.fn(),
}));

// Mock loginDal
vi.mock("../login/_dal/loginDal", () => ({
  getUserByUsername: vi.fn(),
}));

const mockCookies = cookies as unknown as Mock;
const mockGetJwtSecrets = getJwtSecrets as unknown as Mock;
const mockVerifyRefreshToken = verifyRefreshToken as unknown as Mock;
const mockSignAccessToken = signAccessToken as unknown as Mock;
const mockSignRefreshToken = signRefreshToken as unknown as Mock;
const mockBuildAuthCookieOptions = buildAuthCookieOptions as unknown as Mock;
const mockGetUserByUsername = getUserByUsername as unknown as Mock;

describe("/auth/refresh route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully refresh tokens with valid refresh token", async () => {
    const mockCookieStore = {
      get: vi.fn((name: string) => {
        if (name === "refresh_token") {
          return { value: "valid-refresh-token" };
        }
        return undefined;
      }),
      set: vi.fn(),
    };

    mockCookies.mockResolvedValue(mockCookieStore);
    mockGetJwtSecrets.mockReturnValue({
      accessTokenSecret: "test-access-secret",
      refreshTokenSecret: "test-refresh-secret",
    });
    mockVerifyRefreshToken.mockReturnValue({
      id: "user-123",
      username: "testuser",
      role: "USER",
    });
    mockGetUserByUsername.mockResolvedValue({
      id: "user-123",
      username: "testuser",
      role: "USER",
      email: "test@test.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    mockSignAccessToken.mockReturnValue("new-access-token");
    mockSignRefreshToken.mockReturnValue("new-refresh-token");
    mockBuildAuthCookieOptions.mockReturnValue({
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });

    const mockRequest = new Request("http://localhost:3000/auth/refresh", {
      method: "POST",
    });

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(data.user).toEqual({
      id: "user-123",
      username: "testuser",
      role: "USER",
    });
    expect(mockCookieStore.set).toHaveBeenCalledTimes(2);
    expect(mockCookieStore.set).toHaveBeenCalledWith(
      "access_token",
      "new-access-token",
      expect.any(Object),
    );
    expect(mockCookieStore.set).toHaveBeenCalledWith(
      "refresh_token",
      "new-refresh-token",
      expect.any(Object),
    );
  });

  it("should return 401 when no refresh token", async () => {
    const mockCookieStore = {
      get: vi.fn(() => undefined),
    };

    mockCookies.mockResolvedValue(mockCookieStore);

    const mockRequest = new Request("http://localhost:3000/auth/refresh", {
      method: "POST",
    });

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.user).toBeNull();
    expect(data.error).toBe("No refresh token");
  });

  it("should return 401 when refresh token is invalid", async () => {
    const mockCookieStore = {
      get: vi.fn((name: string) => {
        if (name === "refresh_token") {
          return { value: "invalid-refresh-token" };
        }
        return undefined;
      }),
      delete: vi.fn(),
    };

    mockCookies.mockResolvedValue(mockCookieStore);
    mockGetJwtSecrets.mockReturnValue({
      accessTokenSecret: "test-access-secret",
      refreshTokenSecret: "test-refresh-secret",
    });
    mockVerifyRefreshToken.mockReturnValue(null);

    const mockRequest = new Request("http://localhost:3000/auth/refresh", {
      method: "POST",
    });

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.user).toBeNull();
    expect(data.error).toBe("Invalid token");
  });
});
