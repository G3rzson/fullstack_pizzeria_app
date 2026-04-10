import { describe, it, expect } from "vitest";
import { pizzaSchema } from "./pizzaSchema";

describe("pizzaSchema", () => {
  const validData = {
    pizzaName: "margherita",
    pizzaPrice32: 2000,
    pizzaPrice45: 3200,
    pizzaDescription: "classic pizza",
    isAvailableOnMenu: true,
  };

  describe("valid data", () => {
    it("accepts valid data", () => {
      const result = pizzaSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it("accepts isAvailableOnMenu = false", () => {
      const result = pizzaSchema.safeParse({
        ...validData,
        isAvailableOnMenu: false,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isAvailableOnMenu).toBe(false);
      }
    });
  });

  describe("pizzaName normalization", () => {
    it("trims whitespace", () => {
      const result = pizzaSchema.safeParse({
        ...validData,
        pizzaName: "  margherita  ",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.pizzaName).toBe("margherita");
      }
    });

    it("converts to lowercase", () => {
      const result = pizzaSchema.safeParse({
        ...validData,
        pizzaName: "MARGHERITA",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.pizzaName).toBe("margherita");
      }
    });

    it("normalizes multiple spaces to single space", () => {
      const result = pizzaSchema.safeParse({
        ...validData,
        pizzaName: "mar g  heri ta",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.pizzaName).toBe("mar g heri ta");
      }
    });

    it("combines all transformations", () => {
      const result = pizzaSchema.safeParse({
        ...validData,
        pizzaName: "  MAR  GHE RITA  ",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.pizzaName).toBe("mar ghe rita");
      }
    });
  });

  describe("pizzaName validation", () => {
    it("rejects empty string", () => {
      const result = pizzaSchema.safeParse({
        ...validData,
        pizzaName: "",
      });
      expect(result.success).toBe(false);
    });

    it("rejects only whitespace", () => {
      const result = pizzaSchema.safeParse({
        ...validData,
        pizzaName: "   ",
      });
      expect(result.success).toBe(false);
    });

    it("accepts exactly 1 character", () => {
      const result = pizzaSchema.safeParse({
        ...validData,
        pizzaName: "a",
      });
      expect(result.success).toBe(true);
    });

    it("accepts exactly 20 characters", () => {
      const result = pizzaSchema.safeParse({
        ...validData,
        pizzaName: "a".repeat(20),
      });
      expect(result.success).toBe(true);
    });

    it("rejects more than 20 characters", () => {
      const result = pizzaSchema.safeParse({
        ...validData,
        pizzaName: "a".repeat(21),
      });
      expect(result.success).toBe(false);
    });
  });

  describe("pizzaPrice validation", () => {
    it("accepts minimum prices of 1", () => {
      const result = pizzaSchema.safeParse({
        ...validData,
        pizzaPrice32: 1,
        pizzaPrice45: 1,
      });
      expect(result.success).toBe(true);
    });

    it("rejects pizzaPrice32 of 0", () => {
      const result = pizzaSchema.safeParse({
        ...validData,
        pizzaPrice32: 0,
      });
      expect(result.success).toBe(false);
    });

    it("rejects pizzaPrice45 of 0", () => {
      const result = pizzaSchema.safeParse({
        ...validData,
        pizzaPrice45: 0,
      });
      expect(result.success).toBe(false);
    });

    it("accepts maximum prices of 9999", () => {
      const result = pizzaSchema.safeParse({
        ...validData,
        pizzaPrice32: 9999,
        pizzaPrice45: 9999,
      });
      expect(result.success).toBe(true);
    });

    it("rejects price above 9999", () => {
      const result = pizzaSchema.safeParse({
        ...validData,
        pizzaPrice32: 10000,
      });
      expect(result.success).toBe(false);
    });

    it("rejects non-number prices", () => {
      const result = pizzaSchema.safeParse({
        ...validData,
        pizzaPrice32: "2000",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("pizzaDescription validation", () => {
    it("trims and normalizes description", () => {
      const result = pizzaSchema.safeParse({
        ...validData,
        pizzaDescription: "  classic   pizza  ",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.pizzaDescription).toBe("classic pizza");
      }
    });

    it("rejects empty description", () => {
      const result = pizzaSchema.safeParse({
        ...validData,
        pizzaDescription: "",
      });
      expect(result.success).toBe(false);
    });

    it("rejects only whitespace description", () => {
      const result = pizzaSchema.safeParse({
        ...validData,
        pizzaDescription: "   ",
      });
      expect(result.success).toBe(false);
    });

    it("accepts exactly 100 characters", () => {
      const result = pizzaSchema.safeParse({
        ...validData,
        pizzaDescription: "a".repeat(100),
      });
      expect(result.success).toBe(true);
    });

    it("rejects more than 100 characters", () => {
      const result = pizzaSchema.safeParse({
        ...validData,
        pizzaDescription: "a".repeat(101),
      });
      expect(result.success).toBe(false);
    });
  });

  describe("missing fields", () => {
    it("rejects missing pizzaName", () => {
      const result = pizzaSchema.safeParse({
        pizzaPrice32: 2000,
        pizzaPrice45: 3200,
        pizzaDescription: "classic pizza",
        isAvailableOnMenu: true,
      });
      expect(result.success).toBe(false);
    });

    it("rejects missing pizzaPrice32", () => {
      const result = pizzaSchema.safeParse({
        pizzaName: "margherita",
        pizzaPrice45: 3200,
        pizzaDescription: "classic pizza",
        isAvailableOnMenu: true,
      });
      expect(result.success).toBe(false);
    });

    it("rejects missing pizzaPrice45", () => {
      const result = pizzaSchema.safeParse({
        pizzaName: "margherita",
        pizzaPrice32: 2000,
        pizzaDescription: "classic pizza",
        isAvailableOnMenu: true,
      });
      expect(result.success).toBe(false);
    });

    it("rejects missing pizzaDescription", () => {
      const result = pizzaSchema.safeParse({
        pizzaName: "margherita",
        pizzaPrice32: 2000,
        pizzaPrice45: 3200,
        isAvailableOnMenu: true,
      });
      expect(result.success).toBe(false);
    });

    it("rejects missing isAvailableOnMenu", () => {
      const result = pizzaSchema.safeParse({
        pizzaName: "margherita",
        pizzaPrice32: 2000,
        pizzaPrice45: 3200,
        pizzaDescription: "classic pizza",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("extra fields", () => {
    it("ignores extra fields", () => {
      const result = pizzaSchema.safeParse({
        ...validData,
        extraField: "ignored",
        anotherId: 123,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(Object.keys(result.data)).toEqual([
          "pizzaName",
          "pizzaPrice32",
          "pizzaPrice45",
          "pizzaDescription",
          "isAvailableOnMenu",
        ]);
        expect(
          (result.data as { extraField?: string }).extraField,
        ).toBeUndefined();
      }
    });
  });
});
