import { describe, it, expect } from "vitest";
import { removeFromCart } from "./removeFromCart";
import { type CartItemType } from "@/lib/cart/CartContext";
import {
  createDrinkItem,
  createPastaItem,
  createPizzaItem,
} from "../_testHelpers/testHelpers";

const pastaItem = createPastaItem({ id: "1", name: "Spaghetti", price: 10 });
const drinkItem = createDrinkItem({ id: "2", name: "Coke", price: 2 });
const pizza32 = createPizzaItem({ id: "3", size: 32, quantity: 1 });
const pizza45 = createPizzaItem({ id: "3", size: 45, quantity: 1 });

describe("removeFromCart function", () => {
  it("removes matching non-pizza item by type and product id", () => {
    const cartItems: CartItemType[] = [pastaItem, drinkItem];

    const updatedCart = removeFromCart(cartItems, pastaItem);

    expect(updatedCart).toEqual([drinkItem]);
  });

  it("removes only the matching pizza size variant", () => {
    const cartItems: CartItemType[] = [pizza32, pizza45, drinkItem];

    const updatedCart = removeFromCart(cartItems, pizza32);

    expect(updatedCart).toEqual([pizza45, drinkItem]);
  });

  it("returns unchanged items when target is not in cart", () => {
    const cartItems: CartItemType[] = [pastaItem, drinkItem];
    const missingPasta: CartItemType = createPastaItem({
      id: "999",
      name: "Nonexistent",
      price: 12,
    });

    const updatedCart = removeFromCart(cartItems, missingPasta);

    expect(updatedCart).toEqual(cartItems);
  });

  it("returns empty array when cart is already empty", () => {
    const updatedCart = removeFromCart([], pastaItem);

    expect(updatedCart).toEqual([]);
  });

  it("does not mutate the original cart array", () => {
    const cartItems: CartItemType[] = [pastaItem, drinkItem];
    const originalSnapshot = structuredClone(cartItems);

    removeFromCart(cartItems, pastaItem);

    expect(cartItems).toEqual(originalSnapshot);
  });
});
