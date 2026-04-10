import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";

const { mockIsDev } = vi.hoisted(() => {
  const mockIsDev = vi.fn();
  return { mockIsDev };
});

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("../_dal/drinkDal", () => ({ updateDrinkDal: vi.fn() }));
vi.mock("../_validation/drinkSchema", () => ({
  drinkSchema: { safeParseAsync: vi.fn() },
}));
vi.mock("@/shared/Functions/idValidator", () => ({
  idValidator: { safeParse: vi.fn() },
}));
vi.mock("@/shared/Functions/hasPermission", () => ({ hasPermission: vi.fn() }));
vi.mock("@/shared/Functions/isDev", () => ({ default: mockIsDev }));
vi.mock("@/shared/Functions/errorLogger", () => ({ errorLogger: vi.fn() }));

import { updateDrinkAction } from "./updateDrinkAction";
import { revalidatePath } from "next/cache";
import { updateDrinkDal } from "../_dal/drinkDal";
import { drinkSchema } from "../_validation/drinkSchema";
import { idValidator } from "@/shared/Functions/idValidator";
import { hasPermission } from "@/shared/Functions/hasPermission";
import { errorLogger } from "@/shared/Functions/errorLogger";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";

describe("updateDrinkAction action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsDev.mockReturnValue(true);
  });

  it("returns unauthorized when permission check fails", async () => {
    (hasPermission as Mock).mockResolvedValue(false);

    const result = await updateDrinkAction("d1", {});

    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.UNAUTHORIZED);
  });

  it("returns invalid id when id validation fails", async () => {
    (hasPermission as Mock).mockResolvedValue({ username: "admin" });
    (idValidator.safeParse as Mock).mockReturnValue({ success: false });

    const result = await updateDrinkAction("bad", {});

    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.INVALID_ID);
  });

  it("returns invalid data when schema validation fails", async () => {
    (hasPermission as Mock).mockResolvedValue({ username: "admin" });
    (idValidator.safeParse as Mock).mockReturnValue({
      success: true,
      data: { id: "d1" },
    });
    (drinkSchema.safeParseAsync as Mock).mockResolvedValue({ success: false });

    const result = await updateDrinkAction("d1", {});

    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.INVALID_DATA);
  });

  it("updates drink and revalidates paths", async () => {
    (hasPermission as Mock).mockResolvedValue({ username: "admin" });
    (idValidator.safeParse as Mock).mockReturnValue({
      success: true,
      data: { id: "d1" },
    });
    (drinkSchema.safeParseAsync as Mock).mockResolvedValue({
      success: true,
      data: { drinkName: "cola", drinkPrice: 500, isAvailableOnMenu: true },
    });

    const result = await updateDrinkAction("d1", {});

    expect(result.success).toBe(true);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.SUCCESS);
    expect(updateDrinkDal).toHaveBeenCalledWith(
      "d1",
      expect.objectContaining({ category: "italok", createdBy: "admin" }),
    );
    expect(revalidatePath).toHaveBeenCalledWith("/drinks");
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard/drinks");
  });

  it("logs with errorLogger in dev mode on error", async () => {
    (hasPermission as Mock).mockRejectedValue(new Error("db error"));

    await updateDrinkAction("d1", {});

    expect(errorLogger).toHaveBeenCalled();
  });

  it("logs with console.error in non-dev mode on error", async () => {
    mockIsDev.mockReturnValue(false);
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    (hasPermission as Mock).mockRejectedValue(new Error("db error"));

    const result = await updateDrinkAction("d1", {});

    expect(consoleSpy).toHaveBeenCalled();
    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.SERVER_ERROR);
    consoleSpy.mockRestore();
  });
});
