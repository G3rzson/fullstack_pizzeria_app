import { CartItemType } from "@/lib/cart/CartContext";

export function increaseQuantity(
  cartItems: CartItemType[],
  itemToIncrease: CartItemType,
): CartItemType[] {
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
