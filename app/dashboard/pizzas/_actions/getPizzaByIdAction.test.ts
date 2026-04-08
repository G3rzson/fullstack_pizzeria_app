import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { getPizzaByIdAction } from "./getPizzaByIdAction";

vi.mock("../_dal/pizzaDal", () => ({ getPizzaByIdDal: vi.fn() }));
vi.mock("@/shared/Functions/idValidator", () => ({
  idValidator: { safeParse: vi.fn() },
}));
vi.mock("@/shared/Functions/hasPermission", () => ({ hasPermission: vi.fn() }));

import { getPizzaByIdDal } from "../_dal/pizzaDal";
import { idValidator } from "@/shared/Functions/idValidator";
import { hasPermission } from "@/shared/Functions/hasPermission";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";

describe("getPizzaByIdAction", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns not found when dal returns null", async () => {
    (hasPermission as Mock).mockResolvedValue({ username: "admin" });
    (idValidator.safeParse as Mock).mockReturnValue({
      success: true,
      data: { id: "p1" },
    });
    (getPizzaByIdDal as Mock).mockResolvedValue(null);

    const result = await getPizzaByIdAction("p1");

    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.NOT_FOUND);
  });

  it("returns mapped pizza on success", async () => {
    (hasPermission as Mock).mockResolvedValue({ username: "admin" });
    (idValidator.safeParse as Mock).mockReturnValue({
      success: true,
      data: { id: "p1" },
    });
    (getPizzaByIdDal as Mock).mockResolvedValue({
      id: "p1",
      pizzaName: "margherita",
      pizzaPrice32: 2000,
      pizzaPrice45: 3000,
      pizzaDescription: "classic",
      isAvailableOnMenu: true,
      image: null,
    });

    const result = await getPizzaByIdAction("p1");

    expect(result.success).toBe(true);
    expect(result.data?.id).toBe("p1");
  });
});
