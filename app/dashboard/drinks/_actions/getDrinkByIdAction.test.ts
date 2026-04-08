import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { getDrinkByIdAction } from "./getDrinkByIdAction";

vi.mock("../_dal/drinkDal", () => ({ getDrinkByIdDal: vi.fn() }));
vi.mock("@/shared/Functions/idValidator", () => ({
  idValidator: { safeParse: vi.fn() },
}));
vi.mock("@/shared/Functions/hasPermission", () => ({ hasPermission: vi.fn() }));

import { getDrinkByIdDal } from "../_dal/drinkDal";
import { idValidator } from "@/shared/Functions/idValidator";
import { hasPermission } from "@/shared/Functions/hasPermission";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";

describe("getDrinkByIdAction", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns not found when dal returns null", async () => {
    (hasPermission as Mock).mockResolvedValue({ username: "admin" });
    (idValidator.safeParse as Mock).mockReturnValue({
      success: true,
      data: { id: "d1" },
    });
    (getDrinkByIdDal as Mock).mockResolvedValue(null);

    const result = await getDrinkByIdAction("d1");

    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.NOT_FOUND);
  });

  it("returns mapped drink on success", async () => {
    (hasPermission as Mock).mockResolvedValue({ username: "admin" });
    (idValidator.safeParse as Mock).mockReturnValue({
      success: true,
      data: { id: "d1" },
    });
    (getDrinkByIdDal as Mock).mockResolvedValue({
      id: "d1",
      drinkName: "cola",
      drinkPrice: 500,
      isAvailableOnMenu: true,
      image: null,
    });

    const result = await getDrinkByIdAction("d1");

    expect(result.success).toBe(true);
    expect(result.data?.id).toBe("d1");
  });
});
