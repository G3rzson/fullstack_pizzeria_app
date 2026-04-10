import { describe, it, expect } from "vitest";
import { type CartItemType } from "@/lib/cart/CartContext";
import { getProductName } from "./getProductName";
import {
  createDrinkItem,
  createPastaItem,
  createPizzaItem,
} from "../_testHelpers/testHelpers";

describe("getProductName function", () => {
  it("returns pizzaName for pizza items", () => {
    const pizzaItem: CartItemType = createPizzaItem({
      id: "1",
      name: "Margherita",
      size: 32,
    });

    expect(getProductName(pizzaItem)).toBe("Margherita");
  });

  it("returns pastaName for pasta items", () => {
    const pastaItem: CartItemType = createPastaItem({
      id: "2",
      name: "Carbonara",
      price: 2200,
    });

    expect(getProductName(pastaItem)).toBe("Carbonara");
  });

  it("returns drinkName for drink items", () => {
    const drinkItem: CartItemType = createDrinkItem({
      id: "3",
      name: "Cola",
      price: 700,
    });

    expect(getProductName(drinkItem)).toBe("Cola");
  });
});
