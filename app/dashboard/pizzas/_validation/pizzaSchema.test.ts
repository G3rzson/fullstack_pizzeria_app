import { describe, it, expect } from "vitest";
import { pizzaSchema } from "./pizzaSchema";

describe("pizzaSchema", () => {
  const valid = {
    pizzaName: "margherita",
    pizzaPrice32: 2000,
    pizzaPrice45: 3200,
    pizzaDescription: "classic pizza",
    isAvailableOnMenu: true,
  };

  it("accepts valid data", () => {
    expect(pizzaSchema.safeParse(valid).success).toBe(true);
  });

  it("normalizes pizza name", () => {
    const result = pizzaSchema.safeParse({
      ...valid,
      pizzaName: "   Mar   Gherita  ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.pizzaName).toBe("mar gherita");
    }
  });

  it("rejects invalid price", () => {
    expect(pizzaSchema.safeParse({ ...valid, pizzaPrice32: 0 }).success).toBe(
      false,
    );
  });

  it("rejects too long description", () => {
    expect(
      pizzaSchema.safeParse({ ...valid, pizzaDescription: "a".repeat(101) })
        .success,
    ).toBe(false);
  });
});
