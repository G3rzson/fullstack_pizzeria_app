import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";

vi.mock("../_dal/drinkDal", () => ({
  getAllAvailableDrinkDal: vi.fn(),
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
import { getAllAvailableDrinkDal } from "../_dal/drinkDal";
import { getAllAvailableDrinkAction } from "./getAllAvailableDrinkAction";

const mockGetAllAvailableDrinkDal = getAllAvailableDrinkDal as unknown as Mock;
const mockErrorLogger = errorLogger as unknown as Mock;
const mockIsDev = isDev as unknown as Mock;

describe("getAllAvailableDrinkAction action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsDev.mockReturnValue(true);
  });

  it("returns mapped available drinks on success", async () => {
    mockGetAllAvailableDrinkDal.mockResolvedValue([
      {
        id: "drink-1",
        drinkName: "Cola",
        drinkPrice: 550,
        isAvailableOnMenu: true,
        image: {
          publicUrl: "/drinks/cola.jpg",
        },
      },
      {
        id: "drink-2",
        drinkName: "Water",
        drinkPrice: 350,
        isAvailableOnMenu: true,
        image: null,
      },
    ]);

    const result = await getAllAvailableDrinkAction();

    expect(mockGetAllAvailableDrinkDal).toHaveBeenCalledOnce();
    expect(result).toEqual({
      success: true,
      message: BACKEND_RESPONSE_MESSAGES.SUCCESS,
      data: [
        {
          id: "drink-1",
          drinkName: "Cola",
          drinkPrice: 550,
          isAvailableOnMenu: true,
          image: {
            publicUrl: "/drinks/cola.jpg",
          },
        },
        {
          id: "drink-2",
          drinkName: "Water",
          drinkPrice: 350,
          isAvailableOnMenu: true,
          image: null,
        },
      ],
    });
  });

  it("logs with errorLogger in dev mode and returns server error", async () => {
    const error = new Error("db error");
    mockGetAllAvailableDrinkDal.mockRejectedValue(error);
    mockIsDev.mockReturnValue(true);

    const result = await getAllAvailableDrinkAction();

    expect(mockErrorLogger).toHaveBeenCalledWith(
      error,
      "server error - getAllAvailableDrinkAction",
    );
    expect(result).toEqual({
      success: false,
      message: BACKEND_RESPONSE_MESSAGES.SERVER_ERROR,
    });
  });

  it("logs with console.error in non-dev mode and returns server error", async () => {
    const error = new Error("db error");
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockGetAllAvailableDrinkDal.mockRejectedValue(error);
    mockIsDev.mockReturnValue(false);

    const result = await getAllAvailableDrinkAction();

    expect(mockErrorLogger).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith("Error fetching drinks:", error);
    expect(result).toEqual({
      success: false,
      message: BACKEND_RESPONSE_MESSAGES.SERVER_ERROR,
    });

    consoleSpy.mockRestore();
  });
});
