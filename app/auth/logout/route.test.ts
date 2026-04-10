import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";

// Mock next/headers is not needed since we're testing the response directly

describe("/auth/logout route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully logout, clear auth cookies and return message", async () => {
    const mockRequest = new Request("http://localhost:3000/auth/logout", {
      method: "POST",
    });

    const response = await POST(mockRequest);
    const data = await response.json();

    const headersWithGetSetCookie = response.headers as Headers & {
      getSetCookie?: () => string[];
    };
    const setCookieValues =
      typeof headersWithGetSetCookie.getSetCookie === "function"
        ? headersWithGetSetCookie.getSetCookie()
        : [response.headers.get("set-cookie") ?? ""];
    const allSetCookies = setCookieValues.join(";");

    expect(data.message).toBe("Sikeres kijelentkezés!");
    expect(response.status).toBe(200);
    expect(allSetCookies).toContain("access_token=");
    expect(allSetCookies).toContain("refresh_token=");
    expect(allSetCookies).toContain("Expires=Thu, 01 Jan 1970 00:00:00 GMT");
  });
});
