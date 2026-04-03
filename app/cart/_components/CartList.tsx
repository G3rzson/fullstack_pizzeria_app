"use client";

import Loading from "@/app/loading";
import { useCart } from "@/lib/cart/useCart";
import CartItemCard from "./CartItemCard";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getTotalPrice } from "@/shared/Functions/cartHelper";
import { priceFormatter } from "@/shared/Functions/priceFormatter";

export default function CartList() {
  const { cartItems, isLoading } = useCart();

  if (isLoading) {
    return (
      <div className="flex grow items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!isLoading && cartItems.length === 0) {
    return (
      <div className="flex grow items-center justify-center">
        <h1 className="text-center text-2xl sm:text-4xl">A kosár üres.</h1>
      </div>
    );
  }

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
      <Card className="p-0 gap-0">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Végösszeg:</span>
            <span className="text-2xl font-bold text-green-500">
              {priceFormatter(getTotalPrice(cartItems))}
            </span>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" size="lg">
            Rendelés leadása
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
