import { type FormattedDrinkType } from "@/app/drinks/_actions/getAllAvailableDrinkAction";
import { type FormattedPastaType } from "@/app/pastas/_actions/getAllAvailablePastaAction";
import { type FormattedPizzaType } from "@/app/pizzas/_actions/getAllAvailablePizzaAction";
import { type CartItem } from "@/lib/cart/CartContext";

export function removeFromMenuArray(
  cartItems: CartItem[],
  itemToRemove: CartItem,
): CartItem[] {
  return cartItems.filter((item) => {
    // Ha nem ugyanaz a típus, megtartjuk
    if (item.type !== itemToRemove.type) return true;

    // Ha nem ugyanaz az id, megtartjuk
    if (item.product.id !== itemToRemove.product.id) return true;

    // Ha pizza, akkor a méretet is ellenőrizni kell
    if (item.type === "pizza" && itemToRemove.type === "pizza") {
      return item.size !== itemToRemove.size; // Különböző méret → megtartjuk
    }

    // Azonos tétel → NEM tartjuk meg (kiszűrjük)
    return false;
  });
}

export function addToMenuArray(
  cartItems: CartItem[],
  newMenuItem: CartItem,
): CartItem[] {
  return [...cartItems, newMenuItem];
}

export function isMenuItemInCart(
  cartItems: CartItem[],
  itemToCheck: CartItem,
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
  menu: FormattedDrinkType | FormattedPastaType | FormattedPizzaType,
  size?: 32 | 45,
): CartItem {
  let newCartItems: CartItem;
  if (type === "pizza") {
    newCartItems = {
      type: "pizza",
      product: menu as FormattedPizzaType,
      size: (size ?? 32) as 32 | 45,
      quantity: 1,
    };
  } else if (type === "pasta") {
    newCartItems = {
      type: "pasta",
      product: menu as FormattedPastaType,
      quantity: 1,
    };
  } else {
    newCartItems = {
      type: "drink",
      product: menu as FormattedDrinkType,
      quantity: 1,
    };
  }
  return newCartItems;
}
