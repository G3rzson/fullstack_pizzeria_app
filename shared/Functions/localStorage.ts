import { CartItem } from "@/lib/cart/CartContext";

export function saveToLocalStorage(cartItems: CartItem[]) {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

export function loadFromLocalStorage(): CartItem[] {
  const data = localStorage.getItem("cartItems");
  return data ? JSON.parse(data) : [];
}

export function clearLocalStorage() {
  localStorage.removeItem("cartItems");
}
