"use client";

import Loading from "@/app/loading";
import { useCart } from "@/lib/cart/useCart";
import CartItemCard from "./CartItemCard";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { getTotalPrice } from "@/shared/Functions/cartHelper";
import { priceFormatter } from "@/shared/Functions/priceFormatter";
import EmptyList from "@/shared/Components/EmptyList";
import MenuNavLink from "@/shared/Components/MenuNavLink";
import { useAuth } from "@/lib/auth/useAuth";

export default function CartList() {
  const { cartItems, isLoading } = useCart();
  const { user } = useAuth();

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
          <MenuNavLink
            href={`/checkout${user ? `?user=${user.id}` : "?user=guest"}`}
            title="Tovább a fizetéshez"
          />
        </CardFooter>
      </Card>
    </div>
  );
}
