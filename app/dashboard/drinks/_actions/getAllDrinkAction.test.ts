import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { getAllDrinkAction } from "./getAllDrinkAction";

vi.mock("../_dal/drinkDal", () => ({ getAllDrinkDal: vi.fn() }));

import { getAllDrinkDal } from "../_dal/drinkDal";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";

describe("getAllDrinkAction", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns mapped drinks on success", async () => {
    (getAllDrinkDal as Mock).mockResolvedValue([
      {
        id: "d1",
        drinkName: "cola",
        drinkPrice: 500,
        isAvailableOnMenu: true,
        image: null,
      },
    ]);

    const result = await getAllDrinkAction();

    expect(result.success).toBe(true);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.SUCCESS);
    expect(result.data).toHaveLength(1);
  });

  it("returns server error when dal throws", async () => {
    (getAllDrinkDal as Mock).mockRejectedValue(new Error("db"));

    const result = await getAllDrinkAction();

    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.SERVER_ERROR);
  });
});
