import { describe, it, expect } from "vitest";
import { type CartItemType } from "@/lib/cart/CartContext";
import { increaseQuantity } from "./increaseQuantity";
import {
  createDrinkItem,
  createPastaItem,
  createPizzaItem,
} from "../_testHelpers/testHelpers";

const pastaItem = createPastaItem({ id: "1", name: "Spaghetti", price: 10 });
const drinkItem = createDrinkItem({
  id: "2",
  name: "Coke",
  price: 2,
  quantity: 2,
});
const pizza32 = createPizzaItem({ id: "3", size: 32, quantity: 1 });
const pizza45 = createPizzaItem({ id: "3", size: 45, quantity: 3 });

describe("increaseQuantity function", () => {
  it("increments quantity for matching non-pizza item", () => {
    const cartItems: CartItemType[] = [pastaItem, drinkItem];

    const updatedCart = increaseQuantity(cartItems, pastaItem);

    expect(updatedCart).toEqual([
      {
        ...pastaItem,
        quantity: 2,
      },
      drinkItem,
    ]);
  });

  it("increments only the matching pizza size variant", () => {
    const cartItems: CartItemType[] = [pizza32, pizza45, drinkItem];

    const updatedCart = increaseQuantity(cartItems, pizza32);

    expect(updatedCart).toEqual([
      {
        ...pizza32,
        quantity: 2,
      },
      pizza45,
      drinkItem,
    ]);
  });

  it("returns unchanged items when target is not in cart", () => {
    const cartItems: CartItemType[] = [pastaItem, drinkItem];
    const missingDrink: CartItemType = createDrinkItem({
      id: "999",
      name: "Sprite",
      price: 3,
    });

    const updatedCart = increaseQuantity(cartItems, missingDrink);

    expect(updatedCart).toEqual(cartItems);
  });

  it("does not mutate the original cart array", () => {
    const cartItems: CartItemType[] = [pastaItem, drinkItem];
    const originalSnapshot = structuredClone(cartItems);

    increaseQuantity(cartItems, pastaItem);

    expect(cartItems).toEqual(originalSnapshot);
  });
});
