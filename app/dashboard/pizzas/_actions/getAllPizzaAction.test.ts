import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { getAllPizzaAction } from "./getAllPizzaAction";

vi.mock("../_dal/pizzaDal", () => ({ getAllPizzaDal: vi.fn() }));

import { getAllPizzaDal } from "../_dal/pizzaDal";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";

describe("getAllPizzaAction", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns mapped pizzas on success", async () => {
    (getAllPizzaDal as Mock).mockResolvedValue([
      {
        id: "p1",
        pizzaName: "margherita",
        pizzaPrice32: 2000,
        pizzaPrice45: 3000,
        pizzaDescription: "classic",
        isAvailableOnMenu: true,
        image: null,
      },
    ]);

    const result = await getAllPizzaAction();

    expect(result.success).toBe(true);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.SUCCESS);
    expect(result.data).toHaveLength(1);
  });

  it("returns server error when dal throws", async () => {
    (getAllPizzaDal as Mock).mockRejectedValue(new Error("db"));

    const result = await getAllPizzaAction();

    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.SERVER_ERROR);
  });
});
