import { describe, it, expect } from "vitest";
import { checkoutSchema } from "./checkoutSchema";

const validInput = {
  fullName: "Teszt   Elek",
  phoneNumber: "+36 30 123 4567",
  postalCode: "1111",
  city: "Budapest",
  street: "Fo   utca",
  houseNumber: "12",
  floor: " 2 / 5 ",
  saveAddress: true,
};

describe("checkoutSchema", () => {
  it("accepts valid input and normalizes fields", () => {
    const result = checkoutSchema.safeParse(validInput);
    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.data.fullName).toBe("Teszt Elek");
    expect(result.data.phoneNumber).toBe("+36301234567");
    expect(result.data.city).toBe("Budapest");
    expect(result.data.street).toBe("Fo utca");
    expect(result.data.floor).toBe("2 / 5");
  });

  it("rejects invalid postalCode", () => {
    const result = checkoutSchema.safeParse({
      ...validInput,
      postalCode: "123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects phone with invalid chars", () => {
    const result = checkoutSchema.safeParse({
      ...validInput,
      phoneNumber: "+36-30-ABC",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty fullName after trim", () => {
    const result = checkoutSchema.safeParse({ ...validInput, fullName: "   " });
    expect(result.success).toBe(false);
  });

  it("accepts missing optional floor", () => {
    const { floor, ...withoutFloor } = validInput;
    const result = checkoutSchema.safeParse(withoutFloor);
    expect(result.success).toBe(true);
  });

  it("rejects non-boolean saveAddress", () => {
    const result = checkoutSchema.safeParse({
      ...validInput,
      saveAddress: "true",
    });
    expect(result.success).toBe(false);
  });
});
