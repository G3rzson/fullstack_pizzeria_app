import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";

const { mockIsDev } = vi.hoisted(() => {
  const mockIsDev = vi.fn();
  return { mockIsDev };
});

vi.mock("../_dal/pizzaDal", () => ({ getAllPizzaDal: vi.fn() }));
vi.mock("@/shared/Functions/isDev", () => ({ default: mockIsDev }));
vi.mock("@/shared/Functions/errorLogger", () => ({ errorLogger: vi.fn() }));

import { getAllPizzaAction } from "./getAllPizzaAction";
import { getAllPizzaDal } from "../_dal/pizzaDal";
import { errorLogger } from "@/shared/Functions/errorLogger";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";

const mockPizza = {
  id: "p1",
  pizzaName: "margherita",
  pizzaPrice32: 2000,
  pizzaPrice45: 3000,
  pizzaDescription: "classic",
  isAvailableOnMenu: true,
  image: null,
};

const mockPizzaWithImage = {
  ...mockPizza,
  image: {
    id: "img1",
    pizzaId: "p1",
    publicId: "cloud-id",
    publicUrl: "https://img.url/pizza.png",
    originalName: "pizza.png",
  },
};

describe("getAllPizzaAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsDev.mockReturnValue(true);
  });

  it("returns mapped pizzas with null image", async () => {
    (getAllPizzaDal as Mock).mockResolvedValue([mockPizza]);

    const result = await getAllPizzaAction();

    expect(result.success).toBe(true);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.SUCCESS);
    expect(result.data).toHaveLength(1);
    expect(result.data![0].image).toBeNull();
  });

  it("returns mapped pizzas with image data", async () => {
    (getAllPizzaDal as Mock).mockResolvedValue([mockPizzaWithImage]);

    const result = await getAllPizzaAction();

    expect(result.success).toBe(true);
    expect(result.data![0].image).toMatchObject({
      id: "img1",
      publicId: "cloud-id",
    });
  });

  it("returns server error when dal throws", async () => {
    (getAllPizzaDal as Mock).mockRejectedValue(new Error("db"));

    const result = await getAllPizzaAction();

    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.SERVER_ERROR);
  });

  it("logs with errorLogger in dev mode on error", async () => {
    (getAllPizzaDal as Mock).mockRejectedValue(new Error("db error"));

    await getAllPizzaAction();

    expect(errorLogger).toHaveBeenCalled();
  });

  it("logs with console.error in non-dev mode on error", async () => {
    mockIsDev.mockReturnValue(false);
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    (getAllPizzaDal as Mock).mockRejectedValue(new Error("db error"));

    const result = await getAllPizzaAction();

    expect(consoleSpy).toHaveBeenCalled();
    expect(result.success).toBe(false);
    consoleSpy.mockRestore();
  });
});
