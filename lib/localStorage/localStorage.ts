import { CartItemType } from "@/lib/cart/CartContext";

export function saveToLocalStorage(cartItems: CartItemType[]) {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

export function loadFromLocalStorage(): CartItemType[] {
  const data = localStorage.getItem("cartItems");
  if (!data) return [];

  try {
    return JSON.parse(data);
  } catch (error) {
    console.warn("Invalid cart data in localStorage, resetting cart.");
    localStorage.removeItem("cartItems");
    return [];
  }
}

export function clearLocalStorage() {
  localStorage.removeItem("cartItems");
}
