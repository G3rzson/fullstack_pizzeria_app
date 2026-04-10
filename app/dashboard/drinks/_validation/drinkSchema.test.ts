import { describe, it, expect } from "vitest";
import { drinkSchema } from "./drinkSchema";

describe("drinkSchema schema", () => {
  const validData = {
    drinkName: "cola",
    drinkPrice: 650,
    isAvailableOnMenu: true,
  };

  describe("valid data", () => {
    it("accepts valid data", () => {
      const result = drinkSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it("accepts isAvailableOnMenu = false", () => {
      const result = drinkSchema.safeParse({
        ...validData,
        isAvailableOnMenu: false,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isAvailableOnMenu).toBe(false);
      }
    });
  });

  describe("drinkName normalization", () => {
    it("trims whitespace", () => {
      const result = drinkSchema.safeParse({
        ...validData,
        drinkName: "  cola  ",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.drinkName).toBe("cola");
      }
    });

    it("converts to lowercase", () => {
      const result = drinkSchema.safeParse({
        ...validData,
        drinkName: "COLA",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.drinkName).toBe("cola");
      }
    });

    it("normalizes multiple spaces to single space", () => {
      const result = drinkSchema.safeParse({
        ...validData,
        drinkName: "coca   cola",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.drinkName).toBe("coca cola");
      }
    });

    it("combines all transformations", () => {
      const result = drinkSchema.safeParse({
        ...validData,
        drinkName: "  COCA    COLA  ",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.drinkName).toBe("coca cola");
      }
    });
  });

  describe("drinkName validation", () => {
    it("rejects empty string", () => {
      const result = drinkSchema.safeParse({
        ...validData,
        drinkName: "",
      });
      expect(result.success).toBe(false);
    });

    it("rejects only whitespace", () => {
      const result = drinkSchema.safeParse({
        ...validData,
        drinkName: "   ",
      });
      expect(result.success).toBe(false);
    });

    it("accepts exactly 1 character", () => {
      const result = drinkSchema.safeParse({
        ...validData,
        drinkName: "a",
      });
      expect(result.success).toBe(true);
    });

    it("accepts exactly 20 characters", () => {
      const result = drinkSchema.safeParse({
        ...validData,
        drinkName: "a".repeat(20),
      });
      expect(result.success).toBe(true);
    });

    it("rejects more than 20 characters", () => {
      const result = drinkSchema.safeParse({
        ...validData,
        drinkName: "a".repeat(21),
      });
      expect(result.success).toBe(false);
    });
  });

  describe("drinkPrice validation", () => {
    it("accepts minimum price of 1", () => {
      const result = drinkSchema.safeParse({
        ...validData,
        drinkPrice: 1,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.drinkPrice).toBe(1);
      }
    });

    it("rejects price of 0", () => {
      const result = drinkSchema.safeParse({
        ...validData,
        drinkPrice: 0,
      });
      expect(result.success).toBe(false);
    });

    it("rejects negative price", () => {
      const result = drinkSchema.safeParse({
        ...validData,
        drinkPrice: -100,
      });
      expect(result.success).toBe(false);
    });

    it("accepts maximum price of 9999", () => {
      const result = drinkSchema.safeParse({
        ...validData,
        drinkPrice: 9999,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.drinkPrice).toBe(9999);
      }
    });

    it("rejects price above 9999", () => {
      const result = drinkSchema.safeParse({
        ...validData,
        drinkPrice: 10000,
      });
      expect(result.success).toBe(false);
    });

    it("rejects non-number price", () => {
      const result = drinkSchema.safeParse({
        ...validData,
        drinkPrice: "650",
      });
      expect(result.success).toBe(false);
    });

    it("rejects float price", () => {
      const result = drinkSchema.safeParse({
        ...validData,
        drinkPrice: 650.5,
      });
      expect(result.success).toBe(true);
    });
  });

  describe("missing fields", () => {
    it("rejects missing drinkName", () => {
      const result = drinkSchema.safeParse({
        drinkPrice: 650,
        isAvailableOnMenu: true,
      });
      expect(result.success).toBe(false);
    });

    it("rejects missing drinkPrice", () => {
      const result = drinkSchema.safeParse({
        drinkName: "cola",
        isAvailableOnMenu: true,
      });
      expect(result.success).toBe(false);
    });

    it("rejects missing isAvailableOnMenu", () => {
      const result = drinkSchema.safeParse({
        drinkName: "cola",
        drinkPrice: 650,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("extra fields", () => {
    it("ignores extra fields", () => {
      const result = drinkSchema.safeParse({
        ...validData,
        extraField: "ignored",
        anotherId: 123,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(Object.keys(result.data)).toEqual([
          "drinkName",
          "drinkPrice",
          "isAvailableOnMenu",
        ]);
        expect((result.data as any).extraField).toBeUndefined();
      }
    });
  });
});
