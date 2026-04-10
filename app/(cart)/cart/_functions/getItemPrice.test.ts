import { describe, it, expect } from "vitest";
import { type CartItemType } from "@/lib/cart/CartContext";
import { getItemPrice } from "./getItemPrice";
import {
  createDrinkItem,
  createPastaItem,
  createPizzaItem,
} from "../_testHelpers/testHelpers";

describe("getItemPrice function", () => {
  it("returns pizzaPrice32 for 32 cm pizza", () => {
    const pizza32: CartItemType = createPizzaItem({
      id: "1",
      size: 32,
      price32: 4000,
      price45: 6000,
    });

    expect(getItemPrice(pizza32)).toBe(4000);
  });

  it("returns pizzaPrice45 for 45 cm pizza", () => {
    const pizza45: CartItemType = createPizzaItem({
      id: "1",
      size: 45,
      price32: 4000,
      price45: 6000,
    });

    expect(getItemPrice(pizza45)).toBe(6000);
  });

  it("returns pastaPrice for pasta", () => {
    const pasta: CartItemType = createPastaItem({
      id: "2",
      name: "Carbonara",
      price: 2200,
    });

    expect(getItemPrice(pasta)).toBe(2200);
  });

  it("returns drinkPrice for drink", () => {
    const drink: CartItemType = createDrinkItem({
      id: "3",
      name: "Cola",
      price: 700,
    });

    expect(getItemPrice(drink)).toBe(700);
  });
});
