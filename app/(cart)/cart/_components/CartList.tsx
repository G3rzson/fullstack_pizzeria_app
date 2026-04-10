"use client";

import Loading from "@/app/loading";
import { useCart } from "@/lib/cart/useCart";
import EmptyList from "@/shared/Components/EmptyList";
import CartItem from "./CartItem";
import Summary from "./Summary";

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
            <CartItem item={item} />
          </li>
        ))}
      </ul>

      <Summary cartItems={cartItems} />
    </div>
  );
}
