import { CartItemType } from "@/lib/cart/CartContext";

export function removeFromCart(
  cartItems: CartItemType[],
  itemToRemove: CartItemType,
): CartItemType[] {
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
