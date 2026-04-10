import { type CartItemType } from "@/lib/cart/CartContext";

export function getProductName(item: CartItemType): string {
  if (item.type === "pizza") {
    return item.product.pizzaName;
  } else if (item.type === "pasta") {
    return item.product.pastaName;
  } else {
    return item.product.drinkName;
  }
}
