import { describe, it, expect } from "vitest";
import { pastaSchema } from "./pastaSchema";

describe("pastaSchema", () => {
  const validData = {
    pastaName: "carbonara",
    pastaPrice: 2800,
    pastaDescription: "creamy pasta",
    isAvailableOnMenu: true,
  };

  describe("valid data", () => {
    it("accepts valid data", () => {
      const result = pastaSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it("accepts isAvailableOnMenu = false", () => {
      const result = pastaSchema.safeParse({
        ...validData,
        isAvailableOnMenu: false,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isAvailableOnMenu).toBe(false);
      }
    });
  });

  describe("pastaName normalization", () => {
    it("trims whitespace", () => {
      const result = pastaSchema.safeParse({
        ...validData,
        pastaName: "  carbonara  ",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.pastaName).toBe("carbonara");
      }
    });

    it("converts to lowercase", () => {
      const result = pastaSchema.safeParse({
        ...validData,
        pastaName: "CARBONARA",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.pastaName).toBe("carbonara");
      }
    });

    it("normalizes multiple spaces to single space", () => {
      const result = pastaSchema.safeParse({
        ...validData,
        pastaName: "car  bo  nara",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.pastaName).toBe("car bo nara");
      }
    });

    it("combines all transformations", () => {
      const result = pastaSchema.safeParse({
        ...validData,
        pastaName: "  CAR   BO NARA  ",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.pastaName).toBe("car bo nara");
      }
    });
  });

  describe("pastaName validation", () => {
    it("rejects empty string", () => {
      const result = pastaSchema.safeParse({
        ...validData,
        pastaName: "",
      });
      expect(result.success).toBe(false);
    });

    it("rejects only whitespace", () => {
      const result = pastaSchema.safeParse({
        ...validData,
        pastaName: "   ",
      });
      expect(result.success).toBe(false);
    });

    it("accepts exactly 1 character", () => {
      const result = pastaSchema.safeParse({
        ...validData,
        pastaName: "a",
      });
      expect(result.success).toBe(true);
    });

    it("accepts exactly 20 characters", () => {
      const result = pastaSchema.safeParse({
        ...validData,
        pastaName: "a".repeat(20),
      });
      expect(result.success).toBe(true);
    });

    it("rejects more than 20 characters", () => {
      const result = pastaSchema.safeParse({
        ...validData,
        pastaName: "a".repeat(21),
      });
      expect(result.success).toBe(false);
    });
  });

  describe("pastaPrice validation", () => {
    it("accepts minimum price of 1", () => {
      const result = pastaSchema.safeParse({
        ...validData,
        pastaPrice: 1,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.pastaPrice).toBe(1);
      }
    });

    it("rejects price of 0", () => {
      const result = pastaSchema.safeParse({
        ...validData,
        pastaPrice: 0,
      });
      expect(result.success).toBe(false);
    });

    it("rejects negative price", () => {
      const result = pastaSchema.safeParse({
        ...validData,
        pastaPrice: -10,
      });
      expect(result.success).toBe(false);
    });

    it("accepts maximum price of 9999", () => {
      const result = pastaSchema.safeParse({
        ...validData,
        pastaPrice: 9999,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.pastaPrice).toBe(9999);
      }
    });

    it("rejects price above 9999", () => {
      const result = pastaSchema.safeParse({
        ...validData,
        pastaPrice: 10000,
      });
      expect(result.success).toBe(false);
    });

    it("rejects non-number price", () => {
      const result = pastaSchema.safeParse({
        ...validData,
        pastaPrice: "2800",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("pastaDescription validation", () => {
    it("trims and normalizes description", () => {
      const result = pastaSchema.safeParse({
        ...validData,
        pastaDescription: "  creamy   pasta  ",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.pastaDescription).toBe("creamy pasta");
      }
    });

    it("rejects empty description", () => {
      const result = pastaSchema.safeParse({
        ...validData,
        pastaDescription: "",
      });
      expect(result.success).toBe(false);
    });

    it("rejects only whitespace description", () => {
      const result = pastaSchema.safeParse({
        ...validData,
        pastaDescription: "   ",
      });
      expect(result.success).toBe(false);
    });

    it("accepts exactly 100 characters", () => {
      const result = pastaSchema.safeParse({
        ...validData,
        pastaDescription: "a".repeat(100),
      });
      expect(result.success).toBe(true);
    });

    it("rejects more than 100 characters", () => {
      const result = pastaSchema.safeParse({
        ...validData,
        pastaDescription: "a".repeat(101),
      });
      expect(result.success).toBe(false);
    });
  });

  describe("missing fields", () => {
    it("rejects missing pastaName", () => {
      const result = pastaSchema.safeParse({
        pastaPrice: 2800,
        pastaDescription: "creamy pasta",
        isAvailableOnMenu: true,
      });
      expect(result.success).toBe(false);
    });

    it("rejects missing pastaPrice", () => {
      const result = pastaSchema.safeParse({
        pastaName: "carbonara",
        pastaDescription: "creamy pasta",
        isAvailableOnMenu: true,
      });
      expect(result.success).toBe(false);
    });

    it("rejects missing pastaDescription", () => {
      const result = pastaSchema.safeParse({
        pastaName: "carbonara",
        pastaPrice: 2800,
        isAvailableOnMenu: true,
      });
      expect(result.success).toBe(false);
    });

    it("rejects missing isAvailableOnMenu", () => {
      const result = pastaSchema.safeParse({
        pastaName: "carbonara",
        pastaPrice: 2800,
        pastaDescription: "creamy pasta",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("extra fields", () => {
    it("ignores extra fields", () => {
      const result = pastaSchema.safeParse({
        ...validData,
        extraField: "ignored",
        anotherId: 123,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(Object.keys(result.data)).toEqual([
          "pastaName",
          "pastaPrice",
          "pastaDescription",
          "isAvailableOnMenu",
        ]);
        expect(
          (result.data as { extraField?: string }).extraField,
        ).toBeUndefined();
      }
    });
  });
});
