import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { createPizzaAction } from "./createPizzaAction";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("../_dal/pizzaDal", () => ({ createPizzaDal: vi.fn() }));
vi.mock("../_validation/pizzaSchema", () => ({
  pizzaSchema: { safeParseAsync: vi.fn() },
}));
vi.mock("@/shared/Functions/hasPermission", () => ({ hasPermission: vi.fn() }));

import { revalidatePath } from "next/cache";
import { createPizzaDal } from "../_dal/pizzaDal";
import { pizzaSchema } from "../_validation/pizzaSchema";
import { hasPermission } from "@/shared/Functions/hasPermission";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";

describe("createPizzaAction", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns unauthorized when permission is missing", async () => {
    (hasPermission as Mock).mockResolvedValue(false);

    const result = await createPizzaAction({});

    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.UNAUTHORIZED);
  });

  it("creates pizza and revalidates paths", async () => {
    (hasPermission as Mock).mockResolvedValue({ username: "admin" });
    (pizzaSchema.safeParseAsync as Mock).mockResolvedValue({
      success: true,
      data: {
        pizzaName: "margherita",
        pizzaPrice32: 2000,
        pizzaPrice45: 3000,
        pizzaDescription: "classic",
        isAvailableOnMenu: true,
      },
    });

    const result = await createPizzaAction({ any: "data" });

    expect(result.success).toBe(true);
    expect(createPizzaDal).toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith("/pizzas");
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard/pizzas");
  });
});
