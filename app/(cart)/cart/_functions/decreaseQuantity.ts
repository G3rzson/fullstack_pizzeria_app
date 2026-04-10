import { CartItemType } from "@/lib/cart/CartContext";

export function decreaseQuantity(
  cartItems: CartItemType[],
  itemToDecrease: CartItemType,
): CartItemType[] {
  return cartItems.flatMap((cartItem) => {
    // Ellenőrizzük hogy ugyanaz a termék-e
    if (cartItem.product.id !== itemToDecrease.product.id) return [cartItem];
    if (cartItem.type !== itemToDecrease.type) return [cartItem];

    // Ha pizza, akkor a méretet is ellenőrizni kell
    if (cartItem.type === "pizza" && itemToDecrease.type === "pizza") {
      if (cartItem.size !== itemToDecrease.size) return [cartItem];
    }

    // Egyezik és 1 darab van belőle → eltávolítjuk
    if (cartItem.quantity <= 1) return [];

    // Egyezik, csökkentjük a quantity-t
    return [
      {
        ...cartItem,
        quantity: cartItem.quantity - 1,
      },
    ];
  });
}
