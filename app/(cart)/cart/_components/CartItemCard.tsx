"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X } from "lucide-react";
import Image from "next/image";
import { CartItem } from "@/lib/cart/CartContext";
import { useCart } from "@/lib/cart/useCart";
import { saveToLocalStorage } from "@/lib/localStorage/localStorage";
import { toast } from "sonner";
import { priceFormatter } from "@/shared/Functions/priceFormatter";
import { Image as ImageIcon } from "lucide-react";
import { textFormatter } from "@/shared/Functions/textFormatter";
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromMenuArray,
  getItemPrice,
  getProductName,
} from "@/shared/Functions/cartHelper";

export default function CartItemCard({ item }: { item: CartItem }) {
  const { cartItems, setCartItems } = useCart();

  const price = getItemPrice(item);
  const subtotal = price * item.quantity;
  const productName = getProductName(item);

  // Mennyiség növelése
  function handleIncrease() {
    const updatedCart = increaseQuantity(cartItems, item);
    setCartItems(updatedCart);
    saveToLocalStorage(updatedCart);
  }

  // Mennyiség csökkentése
  function handleDecrease() {
    if (item.quantity === 1) {
      handleRemove();
      return;
    }

    const updatedCart = decreaseQuantity(cartItems, item);
    setCartItems(updatedCart);
    saveToLocalStorage(updatedCart);
  }

  // Eltávolítás
  function handleRemove() {
    const updatedCart = removeFromMenuArray(cartItems, item);
    setCartItems(updatedCart);
    saveToLocalStorage(updatedCart);
    toast.success("Eltávolítva a kosárból!");
  }

  const imageUrl = item.product.image?.publicUrl;

  return (
    <Card className="bg-gradient px-4">
      <div className="flex w-full flex-col md:flex-row gap-4 md:gap-0 items-center justify-between">
        <div className="flex w-full items-center md:justify-start justify-between gap-4">
          {/* Kép */}
          {imageUrl ? (
            <div className="relative h-20 w-20 shrink-0 rounded-md overflow-hidden">
              <Image
                src={imageUrl}
                alt={productName}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
          ) : (
            <div className="relative h-20 w-20 shrink-0 rounded-md overflow-hidden">
              <ImageIcon className="w-full h-full" />
            </div>
          )}

          {/* Info */}
          <div className="flex-1 gap-1 flex flex-col text-end md:text-center">
            <h3 className="font-semibold">{textFormatter(productName)}</h3>
            {item.type === "pizza" && (
              <p className="text-sm text-accent-foreground">
                Méret: {item.size} cm
              </p>
            )}
            <p className="text-sm text-success font-semibold">
              {priceFormatter(price)}
            </p>
          </div>
        </div>

        <div className="flex grow flex-row items-center gap-8 md:justify-end justify-between w-full md:w-auto">
          {/* Quantity gombok */}
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="secondary"
              onClick={handleDecrease}
              className="h-8 w-8"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center font-semibold">
              {item.quantity}
            </span>
            <Button
              size="icon"
              variant="secondary"
              onClick={handleIncrease}
              className="h-8 w-8"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Részösszeg */}
          <p className="font-semibold text-center w-20 text-success">
            {priceFormatter(subtotal)}
          </p>

          {/* Törlés gomb */}
          <Button
            size="icon"
            variant="secondary"
            onClick={handleRemove}
            className="h-8 w-8 text-destructive hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
