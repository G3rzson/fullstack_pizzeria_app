import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";

// Mock next/headers is not needed since we're testing the response directly

describe("/auth/logout route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully logout and return logged out message", async () => {
    const mockRequest = new Request("http://localhost:3000/auth/logout", {
      method: "POST",
    });

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(data.message).toBe("Sikeres kijelentkezés!");
    expect(response.status).toBe(200);
  });
});
