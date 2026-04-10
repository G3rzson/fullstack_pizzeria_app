import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { hasPermission } from "./hasPermission";

vi.mock("../../lib/auth/getUserFromCookie", () => ({
  getUserFromCookie: vi.fn(),
}));

vi.mock("@/app/auth/_dal/userDal", () => ({
  getUserDal: vi.fn(),
}));

import { getUserFromCookie } from "../../lib/auth/getUserFromCookie";
import { getUserDal } from "@/app/auth/_dal/userDal";

const mockUserDataFromCookie = getUserFromCookie as Mock;
const mockGetUserDal = getUserDal as Mock;

describe("hasPermission", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return false if no user data in cookie", async () => {
    mockUserDataFromCookie.mockResolvedValue(null);
    const result = await hasPermission();
    expect(result).toBe(false);
  });

  it("should return false if user is not found in database", async () => {
    mockUserDataFromCookie.mockResolvedValue({ id: "user-id" });
    mockGetUserDal.mockResolvedValue(null);
    const result = await hasPermission();
    expect(result).toBe(false);
  });

  it("should return false if user is not an admin", async () => {
    mockUserDataFromCookie.mockResolvedValue({ id: "user-id" });
    mockGetUserDal.mockResolvedValue({
      id: "user-id",
      username: "testuser",
      role: "USER",
      isStillWorkingHere: true,
    });
    const result = await hasPermission();
    expect(result).toBe(false);
  });

  it("should return false if user is not currently working here", async () => {
    mockUserDataFromCookie.mockResolvedValue({ id: "user-id" });
    mockGetUserDal.mockResolvedValue({
      id: "user-id",
      username: "testuser",
      role: "ADMIN",
      isStillWorkingHere: false,
    });
    const result = await hasPermission();
    expect(result).toBe(false);
  });

  it("should return username if user has permission", async () => {
    mockUserDataFromCookie.mockResolvedValue({ id: "user-id" });
    mockGetUserDal.mockResolvedValue({
      id: "user-id",
      username: "testuser",
      role: "ADMIN",
      isStillWorkingHere: true,
    });
    const result = await hasPermission();
    expect(result).toEqual({ username: "testuser" });
  });
});
