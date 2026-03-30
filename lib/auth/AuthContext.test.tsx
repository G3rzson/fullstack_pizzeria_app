import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { AuthProvider } from "./AuthContext";
import { useAuth } from "./useAuth";

describe("AuthProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with null user and call /auth/me on mount", async () => {
    const mockFetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            user: {
              id: "user-123",
              username: "testuser",
              role: "USER",
            },
          }),
      } as Response),
    );
    global.fetch = mockFetch;

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toEqual({
      id: "user-123",
      username: "testuser",
      role: "USER",
    });
    expect(mockFetch).toHaveBeenCalledWith("/auth/me");
  });

  it("should set user to null when /auth/me fails", async () => {
    const mockFetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ user: null }),
      } as Response),
    );
    global.fetch = mockFetch;

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toBeNull();
  });

  it("should attempt refresh when /auth/me returns null user", async () => {
    const mockFetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ user: null }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            user: {
              id: "user-456",
              username: "refresheduser",
              role: "ADMIN",
            },
          }),
      } as Response);
    global.fetch = mockFetch;

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toEqual({
      id: "user-456",
      username: "refresheduser",
      role: "ADMIN",
    });
    expect(mockFetch).toHaveBeenCalledWith("/auth/me");
    expect(mockFetch).toHaveBeenCalledWith("/auth/refresh", { method: "POST" });
  });

  it("should update user when login is called", async () => {
    const mockFetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ user: null }),
      } as Response),
    );
    global.fetch = mockFetch;

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toBeNull();

    const newUser = {
      id: "new-user",
      username: "newuser",
      role: "USER" as const,
    };
    act(() => {
      result.current.login(newUser);
    });

    expect(result.current.user).toEqual(newUser);
  });

  it("should set user to null when logout is called", async () => {
    const mockFetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            user: {
              id: "user-123",
              username: "testuser",
              role: "USER",
            },
          }),
      } as Response),
    );
    global.fetch = mockFetch;

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.user).toEqual({
        id: "user-123",
        username: "testuser",
        role: "USER",
      });
    });

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
  });

  it("should handle fetch error in refreshUser", async () => {
    const mockFetch = vi.fn(() => Promise.reject(new Error("Network error")));
    global.fetch = mockFetch;
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith(
      "Auth check failed:",
      expect.any(Error),
    );

    consoleSpy.mockRestore();
  });
});
