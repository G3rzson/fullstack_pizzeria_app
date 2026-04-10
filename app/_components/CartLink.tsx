"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart/useCart";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function CartLink() {
  const { cartItems } = useCart();
  return (
    <div className="relative">
      <Button asChild variant="outline">
        <Link href="/cart" aria-label="Kosár" title="Kosár">
          <ShoppingCart />
        </Link>
      </Button>

      {cartItems.length > 0 && (
        <p className="bg-green-200 dark:bg-green-800 text-sm w-5 h-5 flex items-center justify-center rounded-full absolute -top-2 -right-2">
          {cartItems.length}
        </p>
      )}
    </div>
  );
}
