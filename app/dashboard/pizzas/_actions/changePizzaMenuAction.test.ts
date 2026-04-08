import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { changePizzaMenuAction } from "./changePizzaMenuAction";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/app/dashboard/pizzas/_dal/pizzaDal", () => ({
  changePizzaMenuDal: vi.fn(),
}));
vi.mock("@/shared/Functions/idValidator", () => ({
  idValidator: { safeParse: vi.fn() },
}));
vi.mock("@/shared/Functions/hasPermission", () => ({ hasPermission: vi.fn() }));

import { revalidatePath } from "next/cache";
import { changePizzaMenuDal } from "@/app/dashboard/pizzas/_dal/pizzaDal";
import { idValidator } from "@/shared/Functions/idValidator";
import { hasPermission } from "@/shared/Functions/hasPermission";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";

describe("changePizzaMenuAction", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns invalid id when validator fails", async () => {
    (hasPermission as Mock).mockResolvedValue({ username: "admin" });
    (idValidator.safeParse as Mock).mockReturnValue({ success: false });

    const result = await changePizzaMenuAction("bad", true);

    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.INVALID_ID);
  });

  it("toggles menu state and revalidates", async () => {
    (hasPermission as Mock).mockResolvedValue({ username: "admin" });
    (idValidator.safeParse as Mock).mockReturnValue({
      success: true,
      data: { id: "p1" },
    });

    const result = await changePizzaMenuAction("p1", true);

    expect(result.success).toBe(true);
    expect(changePizzaMenuDal).toHaveBeenCalledWith("p1", false);
    expect(revalidatePath).toHaveBeenCalledWith("/pizzas");
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard/pizzas");
  });
});
