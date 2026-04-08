import { describe, it, expect } from "vitest";
import { drinkSchema } from "./drinkSchema";

describe("drinkSchema", () => {
  const valid = {
    drinkName: "cola",
    drinkPrice: 650,
    isAvailableOnMenu: true,
  };

  it("accepts valid data", () => {
    expect(drinkSchema.safeParse(valid).success).toBe(true);
  });

  it("normalizes drink name", () => {
    const result = drinkSchema.safeParse({
      ...valid,
      drinkName: "   Co   La  ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.drinkName).toBe("co la");
    }
  });

  it("rejects invalid price", () => {
    expect(drinkSchema.safeParse({ ...valid, drinkPrice: 0 }).success).toBe(
      false,
    );
  });

  it("rejects too long name", () => {
    expect(
      drinkSchema.safeParse({ ...valid, drinkName: "a".repeat(21) }).success,
    ).toBe(false);
  });
});
