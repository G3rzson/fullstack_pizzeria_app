"use client";

import Loading from "@/app/loading";
import { useCart } from "@/lib/cart/useCart";
import CartItemCard from "./CartItemCard";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { getTotalPrice } from "@/shared/Functions/cartHelper";
import { priceFormatter } from "@/shared/Functions/priceFormatter";
import ActionModal from "@/shared/Components/ActionModal";
import EmptyList from "@/shared/Components/EmptyList";

export default function CartList() {
  const { cartItems, isLoading } = useCart();

  if (isLoading) {
    return (
      <div className="centered-container">
        <Loading />
      </div>
    );
  }

  if (!isLoading && cartItems.length === 0)
    return <EmptyList text="A kosarad üres!" />;

  return (
    <div className="space-y-4 my-6">
      {/* Cart items lista */}
      <ul className="space-y-3">
        {cartItems.map((item, index) => (
          <li
            key={`${item.product.id}-${item.type}-${item.type === "pizza" ? item.size : ""}-${index}`}
          >
            <CartItemCard item={item} />
          </li>
        ))}
      </ul>

      {/* Összesítés */}
      <Card className="bg-gradient p-0 gap-0">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Végösszeg:</span>
            <span className="text-2xl font-bold text-success">
              {priceFormatter(getTotalPrice(cartItems))}
            </span>
          </div>
        </CardContent>
        <CardFooter>
          <ActionModal
            triggerTitle="Tovább a fizetéshez"
            description="A fizetési rendszer fejlesztés alatt!"
            action={() => {}}
          />
        </CardFooter>
      </Card>
    </div>
  );
}
