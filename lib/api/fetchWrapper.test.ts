import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchWithAuth } from "./fetchWrapper";

describe("fetchWithAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return response directly when status is not 401", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: "success" }),
      } as Response),
    );

    const response = await fetchWithAuth("/api/test");

    expect(response.status).toBe(200);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("should forward custom request options", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: "success" }),
      } as Response),
    );

    await fetchWithAuth("/api/test", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ foo: "bar" }),
    });

    expect(global.fetch).toHaveBeenCalledWith("/api/test", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ foo: "bar" }),
      credentials: "include",
    });
  });

  it("should attempt refresh and retry when response is 401", async () => {
    global.fetch = vi
      .fn()
      // First call - original request returns 401
      .mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: "Unauthorized" }),
      } as Response)
      // Second call - refresh endpoint
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ user: { id: "1", username: "test" } }),
      } as Response)
      // Third call - retry original request
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: "success" }),
      } as Response);

    const response = await fetchWithAuth("/api/test");

    expect(response.status).toBe(200);
    expect(global.fetch).toHaveBeenCalledTimes(3);
    expect(global.fetch).toHaveBeenNthCalledWith(1, "/api/test", {
      credentials: "include",
    });
    expect(global.fetch).toHaveBeenNthCalledWith(2, "/auth/refresh", {
      method: "POST",
      credentials: "include",
    });
    expect(global.fetch).toHaveBeenNthCalledWith(3, "/api/test", {
      credentials: "include",
    });
  });

  it("should return 401 when refresh fails", async () => {
    global.fetch = vi
      .fn()
      // First call - original request returns 401
      .mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: "Unauthorized" }),
      } as Response)
      // Second call - refresh endpoint fails
      .mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: "Invalid refresh token" }),
      } as Response);

    const response = await fetchWithAuth("/api/test");

    expect(response.status).toBe(401);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it("should return original 401 when refresh response has no user", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: "Unauthorized" }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ user: null }),
      } as Response);

    const response = await fetchWithAuth("/api/test");

    expect(response.status).toBe(401);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it("should return original 401 when refresh throws", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 401,
      } as Response)
      .mockRejectedValueOnce(new Error("network"));

    const response = await fetchWithAuth("/api/test");

    expect(response.status).toBe(401);
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("should handle concurrent refresh attempts", async () => {
    global.fetch = vi
      .fn()
      // Multiple 401 responses
      .mockResolvedValueOnce({
        ok: false,
        status: 401,
      } as Response)
      .mockResolvedValueOnce({
        ok: false,
        status: 401,
      } as Response)
      // One refresh call
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ user: { id: "1" } }),
      } as Response)
      // Retry calls
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
      } as Response);

    // Két párhuzamos request
    const [response1, response2] = await Promise.all([
      fetchWithAuth("/api/test1"),
      fetchWithAuth("/api/test2"),
    ]);

    expect(response1.status).toBe(200);
    expect(response2.status).toBe(200);
    // Csak egy refresh hívás történjen
    const refreshCalls = (
      global.fetch as ReturnType<typeof vi.fn>
    ).mock.calls.filter((call) => call[0] === "/auth/refresh").length;
    expect(refreshCalls).toBe(1);
  });
});
