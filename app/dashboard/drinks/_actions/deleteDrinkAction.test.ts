import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";

const { mockIsDev } = vi.hoisted(() => {
  const mockIsDev = vi.fn();
  return { mockIsDev };
});

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("../_dal/drinkDal", () => ({ deleteDrinkDal: vi.fn() }));
vi.mock("@/shared/Functions/idValidator", () => ({
  idValidator: { safeParse: vi.fn() },
}));
vi.mock("@/shared/Functions/hasPermission", () => ({ hasPermission: vi.fn() }));
vi.mock("@/shared/Functions/isDev", () => ({ default: mockIsDev }));
vi.mock("@/shared/Functions/errorLogger", () => ({ errorLogger: vi.fn() }));
vi.mock("@/lib/claudinary/deleteCloudinaryImage", () => ({
  deleteCloudinaryImage: vi.fn(),
}));

import { deleteDrinkAction } from "./deleteDrinkAction";
import { revalidatePath } from "next/cache";
import { deleteDrinkDal } from "../_dal/drinkDal";
import { idValidator } from "@/shared/Functions/idValidator";
import { hasPermission } from "@/shared/Functions/hasPermission";
import { errorLogger } from "@/shared/Functions/errorLogger";
import { deleteCloudinaryImage } from "@/lib/claudinary/deleteCloudinaryImage";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";

describe("deleteDrinkAction action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsDev.mockReturnValue(true);
  });

  it("returns unauthorized when permission check fails", async () => {
    (hasPermission as Mock).mockResolvedValue(false);

    const result = await deleteDrinkAction("d1", null);

    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.UNAUTHORIZED);
  });

  it("returns invalid id when id is invalid", async () => {
    (hasPermission as Mock).mockResolvedValue({ username: "admin" });
    (idValidator.safeParse as Mock).mockReturnValue({ success: false });

    const result = await deleteDrinkAction("bad", null);

    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.INVALID_ID);
  });

  it("deletes drink without cloudinary call when publicId is null", async () => {
    (hasPermission as Mock).mockResolvedValue({ username: "admin" });
    (idValidator.safeParse as Mock).mockReturnValue({
      success: true,
      data: { id: "d1" },
    });

    const result = await deleteDrinkAction("d1", null);

    expect(result.success).toBe(true);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.SUCCESS);
    expect(deleteDrinkDal).toHaveBeenCalledWith("d1");
    expect(deleteCloudinaryImage).not.toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith("/drinks");
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard/drinks");
  });

  it("deletes drink image from cloudinary when publicId is provided", async () => {
    (hasPermission as Mock).mockResolvedValue({ username: "admin" });
    (idValidator.safeParse as Mock).mockReturnValue({
      success: true,
      data: { id: "d1" },
    });

    const result = await deleteDrinkAction("d1", "cloud-public-id");

    expect(result.success).toBe(true);
    expect(deleteDrinkDal).toHaveBeenCalledWith("d1");
    expect(deleteCloudinaryImage).toHaveBeenCalledWith("cloud-public-id");
  });

  it("logs with errorLogger in dev mode on error", async () => {
    (hasPermission as Mock).mockRejectedValue(new Error("db error"));

    await deleteDrinkAction("d1", null);

    expect(errorLogger).toHaveBeenCalled();
  });

  it("logs with console.error in non-dev mode on error", async () => {
    mockIsDev.mockReturnValue(false);
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    (hasPermission as Mock).mockRejectedValue(new Error("db error"));

    const result = await deleteDrinkAction("d1", null);

    expect(consoleSpy).toHaveBeenCalled();
    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.SERVER_ERROR);
    consoleSpy.mockRestore();
  });
});
