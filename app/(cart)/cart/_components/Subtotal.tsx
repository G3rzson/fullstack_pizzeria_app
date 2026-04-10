import { CartItemType } from "@/lib/cart/CartContext";
import { priceFormatter } from "@/shared/Functions/priceFormatter";
import { getItemPrice } from "../_functions/getItemPrice";

export default function Subtotal({ item }: { item: CartItemType }) {
  const price = getItemPrice(item);
  const subtotal = price * item.quantity;
  return (
    <p className="font-semibold text-center w-20 text-success">
      {priceFormatter(subtotal)}
    </p>
  );
}
