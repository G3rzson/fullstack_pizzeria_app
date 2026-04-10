import { CartItemType } from "@/lib/cart/CartContext";

export function getItemPrice(item: CartItemType): number {
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
