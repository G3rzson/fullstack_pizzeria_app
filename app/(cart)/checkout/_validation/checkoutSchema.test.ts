import { describe, it, expect } from "vitest";
import { checkoutSchema } from "./checkoutSchema";

describe("checkoutSchema", () => {
  const validData = {
    fullName: "Teszt Elek",
    phoneNumber: "+36 30 123 4567",
    postalCode: "1111",
    city: "Budapest",
    street: "Fo utca",
    houseNumber: "12",
    floor: "2/5",
    saveAddress: true,
  };

  it("accepts valid checkout data and normalizes phone", () => {
    const result = checkoutSchema.safeParse(validData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.phoneNumber).toBe("+36301234567");
    }
  });

  it("rejects invalid postal code", () => {
    const result = checkoutSchema.safeParse({
      ...validData,
      postalCode: "123",
    });

    expect(result.success).toBe(false);
  });
});
