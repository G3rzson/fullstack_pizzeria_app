import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getJwtSecrets,
  buildAuthCookieOptions,
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  type AuthTokenPayload,
} from "./jwt";

describe("JWT Functions", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("getJwtSecrets", () => {
    it("should return secrets when environment variables are set", () => {
      process.env.JWT_ACCESS_SECRET = "test-access-secret";
      process.env.JWT_REFRESH_SECRET = "test-refresh-secret";

      const result = getJwtSecrets();

      expect(result).toEqual({
        accessTokenSecret: "test-access-secret",
        refreshTokenSecret: "test-refresh-secret",
      });
    });

    it("should return null when secrets are missing", () => {
      delete process.env.JWT_ACCESS_SECRET;
      delete process.env.JWT_REFRESH_SECRET;

      const result = getJwtSecrets();

      expect(result).toBeNull();
    });
  });

  describe("buildAuthCookieOptions", () => {
    it("should return cookie options with correct structure", () => {
      const result = buildAuthCookieOptions(3600);

      expect(result).toHaveProperty("httpOnly", true);
      expect(result).toHaveProperty("secure");
      expect(result).toHaveProperty("sameSite", "strict");
      expect(result).toHaveProperty("path", "/");
      expect(result).toHaveProperty("maxAge", 3600);
      expect(typeof result.secure).toBe("boolean");
    });
  });

  describe("signAccessToken and signRefreshToken", () => {
    const payload: AuthTokenPayload = {
      id: "user-123",
      username: "testuser",
      role: "USER",
    };
    const secret = "test-secret";

    it("should sign access token successfully", () => {
      const token = signAccessToken(payload, secret);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.length).toBeGreaterThan(0);
    });

    it("should sign refresh token successfully", () => {
      const token = signRefreshToken(payload, secret);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.length).toBeGreaterThan(0);
    });
  });

  describe("verifyAccessToken", () => {
    const payload: AuthTokenPayload = {
      id: "user-123",
      username: "testuser",
      role: "USER",
    };
    const secret = "test-secret";

    it("should verify valid access token", () => {
      const token = signAccessToken(payload, secret);
      const result = verifyAccessToken(token, secret);

      expect(result).toEqual(payload);
    });

    it("should return null for invalid token", () => {
      const result = verifyAccessToken("invalid-token", secret);

      expect(result).toBeNull();
    });

    it("should return null for token with wrong secret", () => {
      const token = signAccessToken(payload, secret);
      const result = verifyAccessToken(token, "wrong-secret");

      expect(result).toBeNull();
    });
  });

  describe("verifyRefreshToken", () => {
    const payload: AuthTokenPayload = {
      id: "user-456",
      username: "adminuser",
      role: "ADMIN",
    };
    const secret = "test-refresh-secret";

    it("should verify valid refresh token", () => {
      const token = signRefreshToken(payload, secret);
      const result = verifyRefreshToken(token, secret);

      expect(result).toEqual(payload);
    });

    it("should return null for invalid token", () => {
      const result = verifyRefreshToken("invalid-token", secret);

      expect(result).toBeNull();
    });
  });
});
