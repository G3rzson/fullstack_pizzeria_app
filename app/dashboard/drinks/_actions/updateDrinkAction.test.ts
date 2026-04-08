import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { updateDrinkAction } from "./updateDrinkAction";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("../_dal/drinkDal", () => ({ updateDrinkDal: vi.fn() }));
vi.mock("../_validation/drinkSchema", () => ({
  drinkSchema: { safeParseAsync: vi.fn() },
}));
vi.mock("@/shared/Functions/idValidator", () => ({
  idValidator: { safeParse: vi.fn() },
}));
vi.mock("@/shared/Functions/hasPermission", () => ({ hasPermission: vi.fn() }));

import { revalidatePath } from "next/cache";
import { updateDrinkDal } from "../_dal/drinkDal";
import { drinkSchema } from "../_validation/drinkSchema";
import { idValidator } from "@/shared/Functions/idValidator";
import { hasPermission } from "@/shared/Functions/hasPermission";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";

describe("updateDrinkAction", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns invalid id when validator fails", async () => {
    (hasPermission as Mock).mockResolvedValue({ username: "admin" });
    (idValidator.safeParse as Mock).mockReturnValue({ success: false });

    const result = await updateDrinkAction("bad", {});

    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.INVALID_ID);
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
    expect(updateDrinkDal).toHaveBeenCalledWith("d1", expect.any(Object));
    expect(revalidatePath).toHaveBeenCalledWith("/drinks");
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard/drinks");
  });
});
