import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { GET } from "./route";
import { cookies } from "next/headers";
import { getJwtSecrets, verifyAccessToken } from "@/lib/auth/jwt";

// Mock next/headers
vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

// Mock jwt functions
vi.mock("@/lib/auth/jwt", () => ({
  getJwtSecrets: vi.fn(),
  verifyAccessToken: vi.fn(),
}));

const mockCookies = cookies as unknown as Mock;
const mockGetJwtSecrets = getJwtSecrets as unknown as Mock;
const mockVerifyAccessToken = verifyAccessToken as unknown as Mock;

describe("/auth/me route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return user data with valid access token", async () => {
    const mockCookieStore = {
      get: vi.fn((name: string) => {
        if (name === "access_token") {
          return { value: "valid-token" };
        }
        return undefined;
      }),
    };

    mockCookies.mockResolvedValue(mockCookieStore);
    mockGetJwtSecrets.mockReturnValue({
      accessTokenSecret: "test-secret",
      refreshTokenSecret: "test-refresh-secret",
    });
    mockVerifyAccessToken.mockReturnValue({
      id: "user-123",
      username: "testuser",
      role: "USER",
    });

    const response = await GET();
    const data = await response.json();

    expect(data.user).toEqual({
      id: "user-123",
      username: "testuser",
      role: "USER",
    });
    expect(mockVerifyAccessToken).toHaveBeenCalledWith(
      "valid-token",
      "test-secret",
    );
  });

  it("should return 401 when no access token", async () => {
    const mockCookieStore = {
      get: vi.fn(() => undefined),
    };

    mockCookies.mockResolvedValue(mockCookieStore);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.user).toBeNull();
    expect(data.error).toBe("No access token");
    expect(mockGetJwtSecrets).not.toHaveBeenCalled();
    expect(mockVerifyAccessToken).not.toHaveBeenCalled();
  });

  it("should return 401 when access token is invalid", async () => {
    const mockCookieStore = {
      get: vi.fn((name: string) => {
        if (name === "access_token") {
          return { value: "invalid-token" };
        }
        return undefined;
      }),
    };

    mockCookies.mockResolvedValue(mockCookieStore);
    mockGetJwtSecrets.mockReturnValue({
      accessTokenSecret: "test-secret",
      refreshTokenSecret: "test-refresh-secret",
    });
    mockVerifyAccessToken.mockReturnValue(null);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.user).toBeNull();
    expect(data.error).toBe("Invalid or expired token");
  });
});
