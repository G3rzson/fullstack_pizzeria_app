import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";

const { mockIsDev } = vi.hoisted(() => {
  const mockIsDev = vi.fn();
  return { mockIsDev };
});

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("../_dal/pizzaDal", () => ({ createPizzaDal: vi.fn() }));
vi.mock("../_validation/pizzaSchema", () => ({
  pizzaSchema: { safeParseAsync: vi.fn() },
}));
vi.mock("@/shared/Functions/hasPermission", () => ({ hasPermission: vi.fn() }));
vi.mock("@/shared/Functions/isDev", () => ({ default: mockIsDev }));
vi.mock("@/shared/Functions/errorLogger", () => ({ errorLogger: vi.fn() }));

import { createPizzaAction } from "./createPizzaAction";
import { revalidatePath } from "next/cache";
import { createPizzaDal } from "../_dal/pizzaDal";
import { pizzaSchema } from "../_validation/pizzaSchema";
import { hasPermission } from "@/shared/Functions/hasPermission";
import { errorLogger } from "@/shared/Functions/errorLogger";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";

describe("createPizzaAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsDev.mockReturnValue(true);
  });

  it("returns unauthorized when permission is missing", async () => {
    (hasPermission as Mock).mockResolvedValue(false);

    const result = await createPizzaAction({});

    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.UNAUTHORIZED);
  });

  it("returns invalid data when schema validation fails", async () => {
    (hasPermission as Mock).mockResolvedValue({ username: "admin" });
    (pizzaSchema.safeParseAsync as Mock).mockResolvedValue({ success: false });

    const result = await createPizzaAction({});

    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.INVALID_DATA);
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

    const result = await createPizzaAction({});

    expect(result.success).toBe(true);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.SUCCESS);
    expect(createPizzaDal).toHaveBeenCalledWith(
      expect.objectContaining({ category: "pizzák", createdBy: "admin" }),
    );
    expect(revalidatePath).toHaveBeenCalledWith("/pizzas");
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard/pizzas");
  });

  it("logs with errorLogger in dev mode on error", async () => {
    (hasPermission as Mock).mockRejectedValue(new Error("db error"));

    await createPizzaAction({});

    expect(errorLogger).toHaveBeenCalled();
  });

  it("logs with console.error in non-dev mode on error", async () => {
    mockIsDev.mockReturnValue(false);
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    (hasPermission as Mock).mockRejectedValue(new Error("db error"));

    const result = await createPizzaAction({});

    expect(consoleSpy).toHaveBeenCalled();
    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.SERVER_ERROR);
    consoleSpy.mockRestore();
  });
});
