import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { proxy } from "./proxy";
import { NextRequest } from "next/server";
import { verifyAccessToken, getJwtSecrets } from "@/lib/auth/jwt";

// Mock jwt functions
vi.mock("@/lib/auth/jwt", () => ({
  verifyAccessToken: vi.fn(),
  getJwtSecrets: vi.fn(),
}));

const mockVerifyAccessToken = verifyAccessToken as Mock;
const mockGetJwtSecrets = getJwtSecrets as Mock;

describe("Middleware - ADMIN Protection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should allow access to non-protected routes without token", async () => {
    const request = new NextRequest("http://localhost:3000/pizzas");

    const response = await proxy(request);

    expect(response).toBeDefined();
    expect(response.status).not.toBe(307); // Not a redirect
  });

  it("should redirect to login when accessing dashboard without token", async () => {
    const request = new NextRequest("http://localhost:3000/dashboard");

    mockGetJwtSecrets.mockReturnValue({
      accessTokenSecret: "test-secret",
      refreshTokenSecret: "test-refresh-secret",
    });

    const response = await proxy(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/auth/login");
  });

  it("should allow ADMIN user to access dashboard with valid access token", async () => {
    const request = new NextRequest("http://localhost:3000/dashboard");
    request.cookies.set("access_token", "valid-admin-token");

    mockGetJwtSecrets.mockReturnValue({
      accessTokenSecret: "test-secret",
      refreshTokenSecret: "test-refresh-secret",
    });
    mockVerifyAccessToken.mockReturnValue({
      id: "admin-123",
      username: "admin",
      role: "ADMIN",
    });

    const response = await proxy(request);

    expect(response).toBeDefined();
    expect(response.status).not.toBe(307); // Not a redirect
  });

  it("should redirect non-ADMIN user away from dashboard", async () => {
    const request = new NextRequest("http://localhost:3000/dashboard");
    request.cookies.set("access_token", "valid-user-token");

    mockGetJwtSecrets.mockReturnValue({
      accessTokenSecret: "test-secret",
      refreshTokenSecret: "test-refresh-secret",
    });
    mockVerifyAccessToken.mockReturnValue({
      id: "user-123",
      username: "user",
      role: "USER",
    });

    const response = await proxy(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/");
  });

  it("should redirect to login when access token is invalid", async () => {
    const request = new NextRequest("http://localhost:3000/dashboard");
    request.cookies.set("access_token", "invalid-token");

    mockGetJwtSecrets.mockReturnValue({
      accessTokenSecret: "test-secret",
      refreshTokenSecret: "test-refresh-secret",
    });
    mockVerifyAccessToken.mockReturnValue(null);

    const response = await proxy(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/auth/login");
  });
});
