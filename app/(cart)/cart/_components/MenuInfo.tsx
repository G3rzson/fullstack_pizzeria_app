import { type CartItemType } from "@/lib/cart/CartContext";
import { priceFormatter } from "@/shared/Functions/priceFormatter";
import { textFormatter } from "@/shared/Functions/textFormatter";
import { getItemPrice } from "../_functions/getItemPrice";
import { getProductName } from "../_functions/getProductName";

export default function MenuInfo({ item }: { item: CartItemType }) {
  const productName = getProductName(item);
  const price = getItemPrice(item);

  return (
    <div className="flex-1 gap-1 flex flex-col text-end md:text-center">
      <h3 className="font-semibold">{textFormatter(productName)}</h3>
      {item.type === "pizza" && (
        <p className="text-sm text-accent-foreground">Méret: {item.size} cm</p>
      )}
      <p className="text-sm text-success font-semibold">
        {priceFormatter(price)}
      </p>
    </div>
  );
}
