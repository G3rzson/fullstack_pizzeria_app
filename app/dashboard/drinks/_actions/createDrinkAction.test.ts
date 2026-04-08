import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { createDrinkAction } from "./createDrinkAction";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("../_dal/drinkDal", () => ({ createDrinkDal: vi.fn() }));
vi.mock("../_validation/drinkSchema", () => ({
  drinkSchema: { safeParseAsync: vi.fn() },
}));
vi.mock("@/shared/Functions/hasPermission", () => ({ hasPermission: vi.fn() }));

import { revalidatePath } from "next/cache";
import { createDrinkDal } from "../_dal/drinkDal";
import { drinkSchema } from "../_validation/drinkSchema";
import { hasPermission } from "@/shared/Functions/hasPermission";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";

describe("createDrinkAction", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns unauthorized when permission is missing", async () => {
    (hasPermission as Mock).mockResolvedValue(false);

    const result = await createDrinkAction({});

    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.UNAUTHORIZED);
  });

  it("creates drink and revalidates paths", async () => {
    (hasPermission as Mock).mockResolvedValue({ username: "admin" });
    (drinkSchema.safeParseAsync as Mock).mockResolvedValue({
      success: true,
      data: { drinkName: "cola", drinkPrice: 500, isAvailableOnMenu: true },
    });

    const result = await createDrinkAction({});

    expect(result.success).toBe(true);
    expect(createDrinkDal).toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith("/drinks");
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard/drinks");
  });
});
