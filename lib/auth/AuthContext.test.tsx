import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { AuthProvider } from "./AuthContext";
import { useAuth } from "./useAuth";

// Mock fetchWrapper
vi.mock("@/lib/api/fetchWrapper", () => ({
  fetchWithAuth: vi.fn(),
}));

import { fetchWithAuth } from "@/lib/api/fetchWrapper";
const mockFetchWithAuth = fetchWithAuth as Mock;

describe("AuthProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with null user and call /auth/me on mount", async () => {
    mockFetchWithAuth.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          user: {
            id: "user-123",
            username: "testuser",
            role: "USER",
          },
        }),
    } as Response);

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
    expect(mockFetchWithAuth).toHaveBeenCalledWith("/auth/me");
  });

  it("should set user to null when /auth/me fails", async () => {
    mockFetchWithAuth.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ user: null }),
    } as Response);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toBeNull();
  });

  it("should set user when /auth/me returns user data", async () => {
    mockFetchWithAuth.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          user: {
            id: "user-456",
            username: "activeuser",
            role: "ADMIN",
          },
        }),
    } as Response);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toEqual({
      id: "user-456",
      username: "activeuser",
      role: "ADMIN",
    });
  });

  it("should update user when login is called", async () => {
    mockFetchWithAuth.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ user: null }),
    } as Response);

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
    mockFetchWithAuth.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          user: {
            id: "user-123",
            username: "testuser",
            role: "USER",
          },
        }),
    } as Response);

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
    mockFetchWithAuth.mockRejectedValue(new Error("Network error"));
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

  it("should update user when refreshUser is called manually", async () => {
    mockFetchWithAuth
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            user: {
              id: "user-1",
              username: "first",
              role: "USER",
            },
          }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            user: {
              id: "user-2",
              username: "second",
              role: "ADMIN",
            },
          }),
      } as Response);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.user).toEqual({
        id: "user-1",
        username: "first",
        role: "USER",
      });
    });

    await act(async () => {
      await result.current.refreshUser();
    });

    expect(result.current.user).toEqual({
      id: "user-2",
      username: "second",
      role: "ADMIN",
    });
    expect(mockFetchWithAuth).toHaveBeenCalledTimes(2);
  });

  it("should clear user when manual refreshUser gets non-ok response", async () => {
    mockFetchWithAuth
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            user: {
              id: "user-1",
              username: "first",
              role: "USER",
            },
          }),
      } as Response)
      .mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ user: null }),
      } as Response);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.user).toEqual({
        id: "user-1",
        username: "first",
        role: "USER",
      });
    });

    await act(async () => {
      await result.current.refreshUser();
    });

    expect(result.current.user).toBeNull();
  });

  it("should throw when useAuth is used outside AuthProvider", () => {
    expect(() => renderHook(() => useAuth())).toThrow(
      "useAuth must be used within an AuthProvider",
    );
  });
});
