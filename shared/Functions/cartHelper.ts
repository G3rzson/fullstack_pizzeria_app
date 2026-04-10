import {
  type PizzaDtoType,
  type PastaDtoType,
  type DrinkDtoType,
} from "@/shared/Types/types";
import { type CartItemType } from "@/lib/cart/CartContext";

export function getTotalPrice(cartItems: CartItemType[]) {
  return cartItems.reduce((sum, item) => {
    const price =
      item.type === "pizza"
        ? item.size === 32
          ? item.product.pizzaPrice32
          : item.product.pizzaPrice45
        : item.type === "pasta"
          ? item.product.pastaPrice
          : item.product.drinkPrice;
    return sum + price * item.quantity;
  }, 0);
}

export function addToMenuArray(
  cartItems: CartItemType[],
  newMenuItem: CartItemType,
): CartItemType[] {
  return [...cartItems, newMenuItem];
}

export function isMenuItemInCart(
  cartItems: CartItemType[],
  itemToCheck: CartItemType,
): boolean {
  return cartItems.some((item) => {
    // Először ellenőrizzük a típust
    if (item.type !== itemToCheck.type) return false;

    // Most már tudjuk, hogy ugyanaz a típus
    if (item.product.id !== itemToCheck.product.id) return false;

    // Ha pizza, akkor a méretet is ellenőrizni kell
    if (item.type === "pizza" && itemToCheck.type === "pizza") {
      return item.size === itemToCheck.size;
    }

    return true;
  });
}

export function createCartItem(
  type: "drink" | "pasta" | "pizza",
  menu: DrinkDtoType | PastaDtoType | PizzaDtoType,
  size?: 32 | 45,
): CartItemType {
  let newCartItems: CartItemType;
  if (type === "pizza") {
    newCartItems = {
      type: "pizza",
      product: menu as PizzaDtoType,
      size: (size ?? 32) as 32 | 45,
      quantity: 1,
    };
  } else if (type === "pasta") {
    newCartItems = {
      type: "pasta",
      product: menu as PastaDtoType,
      quantity: 1,
    };
  } else {
    newCartItems = {
      type: "drink",
      product: menu as DrinkDtoType,
      quantity: 1,
    };
  }
  return newCartItems;
}
