import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "./route";
import { cookies } from "next/headers";
import {
  getJwtSecrets,
  verifyRefreshToken,
  signAccessToken,
  signRefreshToken,
  buildAuthCookieOptions,
} from "@/lib/auth/jwt";
import { getUserByUsername } from "../login/_dal/loginDal";

// Mock next/headers
vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

// Mock jwt functions
vi.mock("@/lib/auth/jwt", () => ({
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
    expect(mockCookieStore.delete).toHaveBeenCalledWith("access_token");
    expect(mockCookieStore.delete).toHaveBeenCalledWith("refresh_token");
  });

  it("should return 500 when jwt secrets are missing", async () => {
    const mockCookieStore = {
      get: vi.fn((name: string) => {
        if (name === "refresh_token") {
          return { value: "valid-refresh-token" };
        }
        return undefined;
      }),
    };

    mockCookies.mockResolvedValue(mockCookieStore);
    mockGetJwtSecrets.mockReturnValue(null);

    const response = await POST(
      new Request("http://localhost:3000/auth/refresh", { method: "POST" }),
    );
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.user).toBeNull();
    expect(data.error).toBe("JWT secrets missing");
    expect(mockVerifyRefreshToken).not.toHaveBeenCalled();
  });

  it("should return 401 when user does not exist", async () => {
    const mockCookieStore = {
      get: vi.fn((name: string) => {
        if (name === "refresh_token") {
          return { value: "valid-refresh-token" };
        }
        return undefined;
      }),
      set: vi.fn(),
      delete: vi.fn(),
    };

    mockCookies.mockResolvedValue(mockCookieStore);
    mockGetJwtSecrets.mockReturnValue({
      accessTokenSecret: "test-access-secret",
      refreshTokenSecret: "test-refresh-secret",
    });
    mockVerifyRefreshToken.mockReturnValue({
      id: "user-123",
      username: "missing-user",
      role: "USER",
    });
    mockGetUserByUsername.mockResolvedValue(null);

    const response = await POST(
      new Request("http://localhost:3000/auth/refresh", { method: "POST" }),
    );
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.user).toBeNull();
    expect(data.error).toBe("User not found");
    expect(mockCookieStore.set).not.toHaveBeenCalled();
  });

  it("GET should redirect back to returnTo on successful refresh", async () => {
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
    });
    mockSignAccessToken.mockReturnValue("new-access-token");
    mockSignRefreshToken.mockReturnValue("new-refresh-token");
    mockBuildAuthCookieOptions.mockReturnValue({
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });

    const response = await GET(
      new NextRequest(
        "http://localhost:3000/auth/refresh?returnTo=%2Fdashboard",
      ),
    );

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/dashboard",
    );
  });

  it("GET should redirect to login with callbackUrl when refresh fails", async () => {
    const mockCookieStore = {
      get: vi.fn(() => undefined),
    };

    mockCookies.mockResolvedValue(mockCookieStore);

    const response = await GET(
      new NextRequest(
        "http://localhost:3000/auth/refresh?returnTo=%2Fdashboard",
      ),
    );

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/auth/login?callbackUrl=%2Fdashboard",
    );
  });

  it("GET should sanitize external returnTo values", async () => {
    const mockCookieStore = {
      get: vi.fn(() => undefined),
    };

    mockCookies.mockResolvedValue(mockCookieStore);

    const response = await GET(
      new NextRequest(
        "http://localhost:3000/auth/refresh?returnTo=https%3A%2F%2Fevil.example",
      ),
    );

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/auth/login?callbackUrl=%2F",
    );
  });
});
