import { describe, it, expect } from "vitest";
import { pastaSchema } from "./pastaSchema";

describe("pastaSchema", () => {
  const valid = {
    pastaName: "carbonara",
    pastaPrice: 2800,
    pastaDescription: "creamy pasta",
    isAvailableOnMenu: true,
  };

  it("accepts valid data", () => {
    expect(pastaSchema.safeParse(valid).success).toBe(true);
  });

  it("normalizes pasta name", () => {
    const result = pastaSchema.safeParse({
      ...valid,
      pastaName: "  Car   Bonara ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.pastaName).toBe("car bonara");
    }
  });

  it("rejects invalid price", () => {
    expect(pastaSchema.safeParse({ ...valid, pastaPrice: 0 }).success).toBe(
      false,
    );
  });

  it("rejects too long description", () => {
    expect(
      pastaSchema.safeParse({ ...valid, pastaDescription: "a".repeat(101) })
        .success,
    ).toBe(false);
  });
});
