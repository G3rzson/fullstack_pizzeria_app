import { type FormattedDrinkType } from "@/app/drinks/_actions/getAllAvailableDrinkAction";
import { type FormattedPastaType } from "@/app/pastas/_actions/getAllAvailablePastaAction";
import { type pizzaDtoType } from "@/app/pizzas/_actions/getAllAvailablePizzaAction";
import { type CartItem } from "@/lib/cart/CartContext";

export function getTotalPrice(cartItems: CartItem[]) {
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
  menu: FormattedDrinkType | FormattedPastaType | pizzaDtoType,
  size?: 32 | 45,
): CartItem {
  let newCartItems: CartItem;
  if (type === "pizza") {
    newCartItems = {
      type: "pizza",
      product: menu as pizzaDtoType,
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

export function increaseQuantity(
  cartItems: CartItem[],
  itemToIncrease: CartItem,
): CartItem[] {
  return cartItems.map((cartItem) => {
    // Ellenőrizzük hogy ugyanaz a termék-e
    if (cartItem.product.id !== itemToIncrease.product.id) return cartItem;
    if (cartItem.type !== itemToIncrease.type) return cartItem;

    // Ha pizza, akkor a méretet is ellenőrizni kell
    if (cartItem.type === "pizza" && itemToIncrease.type === "pizza") {
      if (cartItem.size !== itemToIncrease.size) return cartItem;
    }

    // Egyezik, növeljük a quantity-t
    return { ...cartItem, quantity: cartItem.quantity + 1 };
  });
}

export function decreaseQuantity(
  cartItems: CartItem[],
  itemToDecrease: CartItem,
): CartItem[] {
  return cartItems.map((cartItem) => {
    // Ellenőrizzük hogy ugyanaz a termék-e
    if (cartItem.product.id !== itemToDecrease.product.id) return cartItem;
    if (cartItem.type !== itemToDecrease.type) return cartItem;

    // Ha pizza, akkor a méretet is ellenőrizni kell
    if (cartItem.type === "pizza" && itemToDecrease.type === "pizza") {
      if (cartItem.size !== itemToDecrease.size) return cartItem;
    }

    // Egyezik, csökkentjük a quantity-t (de minimum 1)
    return {
      ...cartItem,
      quantity: Math.max(1, cartItem.quantity - 1),
    };
  });
}

export function getItemPrice(item: CartItem): number {
  if (item.type === "pizza") {
    return item.size === 32
      ? item.product.pizzaPrice32
      : item.product.pizzaPrice45;
  } else if (item.type === "pasta") {
    return item.product.pastaPrice;
  } else {
    return item.product.drinkPrice;
  }
}

export function getProductName(item: CartItem): string {
  if (item.type === "pizza") {
    return item.product.pizzaName;
  } else if (item.type === "pasta") {
    return item.product.pastaName;
  } else {
    return item.product.drinkName;
  }
}
