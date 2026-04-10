"use client";

import { Card } from "@/components/ui/card";
import { type CartItemType } from "@/lib/cart/CartContext";
import Subtotal from "./Subtotal";
import MenuInfo from "./MenuInfo";
import CartImage from "./CartImage";
import Quantity from "./Quantity";
import CartFnBtn from "./CartFnBtn";
import { Minus, Plus, X } from "lucide-react";

export default function CartItem({ item }: { item: CartItemType }) {
  return (
    <Card className="bg-gradient px-4">
      <div className="flex w-full flex-col md:flex-row gap-4 md:gap-0 items-center justify-between">
        <div className="flex w-full items-center md:justify-start justify-between gap-4">
          <CartImage item={item} />

          <MenuInfo item={item} />
        </div>

        <div className="flex grow flex-row items-center gap-8 md:justify-end justify-between w-full md:w-auto">
          <div className="flex items-center gap-1">
            <CartFnBtn item={item} action="decrease">
              <Minus />
            </CartFnBtn>

            <Quantity item={item} />

            <CartFnBtn item={item} action="increase">
              <Plus />
            </CartFnBtn>
          </div>

          <Subtotal item={item} />

          <CartFnBtn item={item} action="remove">
            <X />
          </CartFnBtn>
        </div>
      </div>
    </Card>
  );
}
