import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { updatePizzaAction } from "./updatePizzaAction";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("../_dal/pizzaDal", () => ({ updatePizzaDal: vi.fn() }));
vi.mock("../_validation/pizzaSchema", () => ({
  pizzaSchema: { safeParseAsync: vi.fn() },
}));
vi.mock("@/shared/Functions/idValidator", () => ({
  idValidator: { safeParse: vi.fn() },
}));
vi.mock("@/shared/Functions/hasPermission", () => ({ hasPermission: vi.fn() }));

import { revalidatePath } from "next/cache";
import { updatePizzaDal } from "../_dal/pizzaDal";
import { pizzaSchema } from "../_validation/pizzaSchema";
import { idValidator } from "@/shared/Functions/idValidator";
import { hasPermission } from "@/shared/Functions/hasPermission";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";

describe("updatePizzaAction", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns invalid data when schema fails", async () => {
    (hasPermission as Mock).mockResolvedValue({ username: "admin" });
    (pizzaSchema.safeParseAsync as Mock).mockResolvedValue({ success: false });

    const result = await updatePizzaAction("p1", {});

    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.INVALID_DATA);
  });

  it("updates pizza and revalidates paths", async () => {
    (hasPermission as Mock).mockResolvedValue({ username: "admin" });
    (pizzaSchema.safeParseAsync as Mock).mockResolvedValue({
      success: true,
      data: {
        pizzaName: "new",
        pizzaPrice32: 1,
        pizzaPrice45: 2,
        pizzaDescription: "x",
        isAvailableOnMenu: true,
      },
    });
    (idValidator.safeParse as Mock).mockReturnValue({
      success: true,
      data: { id: "p1" },
    });

    const result = await updatePizzaAction("p1", {});

    expect(result.success).toBe(true);
    expect(updatePizzaDal).toHaveBeenCalledWith("p1", expect.any(Object));
    expect(revalidatePath).toHaveBeenCalledWith("/pizzas");
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard/pizzas");
  });
});
