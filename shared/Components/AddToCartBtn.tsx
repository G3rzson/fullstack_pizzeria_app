"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart/useCart";
import {
  type PizzaDtoType,
  type PastaDtoType,
  type DrinkDtoType,
} from "@/shared/Types/types";
import { toast } from "sonner";
import { type CartItem } from "@/lib/cart/CartContext";
import { saveToLocalStorage } from "../Functions/localStorage";
import {
  addToMenuArray,
  createCartItem,
  isMenuItemInCart,
  removeFromMenuArray,
} from "../Functions/cartHelper";

type Props = {
  menu: DrinkDtoType | PastaDtoType | PizzaDtoType;
  type: "drink" | "pasta" | "pizza";
  size?: 32 | 45;
};

export default function AddToCartBtn({ menu, type, size }: Props) {
  const { cartItems, setCartItems, isLoading, setIsLoading } = useCart();
  const newMenuItem = createCartItem(type, menu, size);
  const isAlreadyInCart = isMenuItemInCart(cartItems, newMenuItem);

  function handleAddToCart() {
    try {
      setIsLoading(true);
      let newMenuArray: CartItem[];

      if (isAlreadyInCart) {
        newMenuArray = removeFromMenuArray(cartItems, newMenuItem);
        saveToLocalStorage(newMenuArray);
        setCartItems(newMenuArray);
        toast.success("Sikeresen eltávolítva a kosárból!");
      } else {
        newMenuArray = addToMenuArray(cartItems, newMenuItem);
        saveToLocalStorage(newMenuArray);
        setCartItems(newMenuArray);
        toast.success("Sikeresen hozzáadva a kosárhoz!");
      }
    } catch (error) {
      toast.error("Hiba történt a kosárhoz adás során! Próbáld újra később.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      variant="outline"
      className="w-full cursor-pointer"
      disabled={isLoading}
      onClick={handleAddToCart}
    >
      {isAlreadyInCart ? "Eltávolítás a kosárból" : "Hozzáadás a kosárhoz"}
    </Button>
  );
}
