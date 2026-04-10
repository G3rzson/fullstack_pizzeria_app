import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";

const { mockIsDev } = vi.hoisted(() => {
  const mockIsDev = vi.fn();
  return { mockIsDev };
});

vi.mock("../_dal/drinkDal", () => ({ getAllDrinkDal: vi.fn() }));
vi.mock("@/shared/Functions/isDev", () => ({ default: mockIsDev }));
vi.mock("@/shared/Functions/errorLogger", () => ({ errorLogger: vi.fn() }));

import { getAllDrinkAction } from "./getAllDrinkAction";
import { getAllDrinkDal } from "../_dal/drinkDal";
import { errorLogger } from "@/shared/Functions/errorLogger";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";

const mockDrink = {
  id: "d1",
  drinkName: "cola",
  drinkPrice: 500,
  isAvailableOnMenu: true,
  image: null,
};

const mockDrinkWithImage = {
  ...mockDrink,
  image: {
    id: "img1",
    drinkId: "d1",
    publicId: "cloud-id",
    publicUrl: "https://img.url/drink.png",
    originalName: "drink.png",
  },
};

describe("getAllDrinkAction action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsDev.mockReturnValue(true);
  });

  it("returns mapped drinks with null image", async () => {
    (getAllDrinkDal as Mock).mockResolvedValue([mockDrink]);

    const result = await getAllDrinkAction();

    expect(result.success).toBe(true);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.SUCCESS);
    expect(result.data).toHaveLength(1);
    expect(result.data![0].image).toBeNull();
  });

  it("returns mapped drinks with image data", async () => {
    (getAllDrinkDal as Mock).mockResolvedValue([mockDrinkWithImage]);

    const result = await getAllDrinkAction();

    expect(result.success).toBe(true);
    expect(result.data![0].image).toMatchObject({
      id: "img1",
      publicId: "cloud-id",
    });
  });

  it("returns server error when dal throws", async () => {
    (getAllDrinkDal as Mock).mockRejectedValue(new Error("db"));

    const result = await getAllDrinkAction();

    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.SERVER_ERROR);
  });

  it("logs with errorLogger in dev mode on error", async () => {
    (getAllDrinkDal as Mock).mockRejectedValue(new Error("db error"));

    await getAllDrinkAction();

    expect(errorLogger).toHaveBeenCalled();
  });

  it("logs with console.error in non-dev mode on error", async () => {
    mockIsDev.mockReturnValue(false);
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    (getAllDrinkDal as Mock).mockRejectedValue(new Error("db error"));

    const result = await getAllDrinkAction();

    expect(consoleSpy).toHaveBeenCalled();
    expect(result.success).toBe(false);
    consoleSpy.mockRestore();
  });
});
