import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";

vi.mock("../_dal/pizzaDal", () => ({
  getAllAvailablePizzaDal: vi.fn(),
}));

vi.mock("@/shared/Functions/errorLogger", () => ({
  errorLogger: vi.fn(),
}));

vi.mock("@/shared/Functions/isDev", () => ({
  default: vi.fn(),
}));

import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";
import { errorLogger } from "@/shared/Functions/errorLogger";
import isDev from "@/shared/Functions/isDev";
import { getAllAvailablePizzaDal } from "../_dal/pizzaDal";
import { getAllAvailablePizzaAction } from "./getAllAvailablePizzaAction";

const mockGetAllAvailablePizzaDal = getAllAvailablePizzaDal as unknown as Mock;
const mockErrorLogger = errorLogger as unknown as Mock;
const mockIsDev = isDev as unknown as Mock;

describe("getAllAvailablePizzaAction action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsDev.mockReturnValue(true);
  });

  it("returns mapped available pizzas on success", async () => {
    mockGetAllAvailablePizzaDal.mockResolvedValue([
      {
        id: "pizza-1",
        pizzaName: "Margherita",
        pizzaPrice32: 2990,
        pizzaPrice45: 4590,
        pizzaDescription: "Classic tomato and mozzarella",
        isAvailableOnMenu: true,
        image: {
          publicUrl: "/pizzas/margherita.jpg",
        },
      },
      {
        id: "pizza-2",
        pizzaName: "Diavola",
        pizzaPrice32: 3490,
        pizzaPrice45: 5190,
        pizzaDescription: "Spicy salami",
        isAvailableOnMenu: true,
        image: null,
      },
    ]);

    const result = await getAllAvailablePizzaAction();

    expect(mockGetAllAvailablePizzaDal).toHaveBeenCalledOnce();
    expect(result).toEqual({
      success: true,
      message: BACKEND_RESPONSE_MESSAGES.SUCCESS,
      data: [
        {
          id: "pizza-1",
          pizzaName: "Margherita",
          pizzaPrice32: 2990,
          pizzaPrice45: 4590,
          pizzaDescription: "Classic tomato and mozzarella",
          image: {
            publicUrl: "/pizzas/margherita.jpg",
          },
        },
        {
          id: "pizza-2",
          pizzaName: "Diavola",
          pizzaPrice32: 3490,
          pizzaPrice45: 5190,
          pizzaDescription: "Spicy salami",
          image: null,
        },
      ],
    });
  });

  it("logs with errorLogger in dev mode and returns server error", async () => {
    const error = new Error("db error");
    mockGetAllAvailablePizzaDal.mockRejectedValue(error);
    mockIsDev.mockReturnValue(true);

    const result = await getAllAvailablePizzaAction();

    expect(mockErrorLogger).toHaveBeenCalledWith(
      error,
      "server error - getAllAvailablePizzaAction",
    );
    expect(result).toEqual({
      success: false,
      message: BACKEND_RESPONSE_MESSAGES.SERVER_ERROR,
    });
  });

  it("logs with console.error in non-dev mode and returns server error", async () => {
    const error = new Error("db error");
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockGetAllAvailablePizzaDal.mockRejectedValue(error);
    mockIsDev.mockReturnValue(false);

    const result = await getAllAvailablePizzaAction();

    expect(mockErrorLogger).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith("Error fetching pizzas:", error);
    expect(result).toEqual({
      success: false,
      message: BACKEND_RESPONSE_MESSAGES.SERVER_ERROR,
    });

    consoleSpy.mockRestore();
  });
});
