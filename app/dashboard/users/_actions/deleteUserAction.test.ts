import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";

const { mockIsDev, mockCookieDelete } = vi.hoisted(() => {
  const mockIsDev = vi.fn();
  const mockCookieDelete = vi.fn();
  return { mockIsDev, mockCookieDelete };
});

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/headers", () => ({ cookies: vi.fn() }));
vi.mock("../_dal/usersDal", () => ({ deleteUserDal: vi.fn() }));
vi.mock("@/lib/auth/getUserFromCookie", () => ({ getUserFromCookie: vi.fn() }));
vi.mock("@/shared/Functions/idValidator", () => ({
  idValidator: { safeParse: vi.fn() },
}));
vi.mock("@/shared/Functions/hasPermission", () => ({ hasPermission: vi.fn() }));
vi.mock("@/shared/Functions/isDev", () => ({ default: mockIsDev }));
vi.mock("@/shared/Functions/errorLogger", () => ({ errorLogger: vi.fn() }));

import { deleteUserAction } from "./deleteUserAction";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { deleteUserDal } from "../_dal/usersDal";
import { getUserFromCookie } from "@/lib/auth/getUserFromCookie";
import { idValidator } from "@/shared/Functions/idValidator";
import { hasPermission } from "@/shared/Functions/hasPermission";
import { errorLogger } from "@/shared/Functions/errorLogger";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";

describe("deleteUserAction action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsDev.mockReturnValue(true);
    (cookies as Mock).mockResolvedValue({ delete: mockCookieDelete });
  });

  it("returns unauthorized when permission check fails", async () => {
    (hasPermission as Mock).mockResolvedValue(false);

    const result = await deleteUserAction("u1");

    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.UNAUTHORIZED);
  });

  it("returns invalid id when id is invalid", async () => {
    (hasPermission as Mock).mockResolvedValue({ username: "admin" });
    (idValidator.safeParse as Mock).mockReturnValue({ success: false });

    const result = await deleteUserAction("bad-id");

    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.INVALID_ID);
  });

  it("deletes own user and clears auth cookies", async () => {
    (hasPermission as Mock).mockResolvedValue({ username: "admin" });
    (idValidator.safeParse as Mock).mockReturnValue({
      success: true,
      data: { id: "u1" },
    });
    (getUserFromCookie as Mock).mockResolvedValue({ id: "u1" });

    const result = await deleteUserAction("u1");

    expect(result.success).toBe(true);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.SUCCESS);
    expect(result.data).toEqual({ isSelfDelete: true });
    expect(deleteUserDal).toHaveBeenCalledWith("u1");
    expect(mockCookieDelete).toHaveBeenCalledWith("access_token");
    expect(mockCookieDelete).toHaveBeenCalledWith("refresh_token");
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard/users");
  });

  it("deletes other user without clearing cookies", async () => {
    (hasPermission as Mock).mockResolvedValue({ username: "admin" });
    (idValidator.safeParse as Mock).mockReturnValue({
      success: true,
      data: { id: "u2" },
    });
    (getUserFromCookie as Mock).mockResolvedValue({ id: "u1" });

    const result = await deleteUserAction("u2");

    expect(result.success).toBe(true);
    expect(result.data).toEqual({ isSelfDelete: false });
    expect(deleteUserDal).toHaveBeenCalledWith("u2");
    expect(mockCookieDelete).not.toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard/users");
  });

  it("logs with errorLogger in dev mode on error", async () => {
    (hasPermission as Mock).mockRejectedValue(new Error("db error"));

    await deleteUserAction("u1");

    expect(errorLogger).toHaveBeenCalled();
  });

  it("logs with console.error in non-dev mode on error", async () => {
    mockIsDev.mockReturnValue(false);
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    (hasPermission as Mock).mockRejectedValue(new Error("db error"));

    const result = await deleteUserAction("u1");

    expect(consoleSpy).toHaveBeenCalled();
    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.SERVER_ERROR);
    consoleSpy.mockRestore();
  });
});
