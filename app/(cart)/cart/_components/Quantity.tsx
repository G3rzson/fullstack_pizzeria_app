import { CartItemType } from "@/lib/cart/CartContext";

export default function Quantity({ item }: { item: CartItemType }) {
  return <span className="w-8 text-center font-semibold">{item.quantity}</span>;
}
