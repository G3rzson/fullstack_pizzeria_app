"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart/useCart";
import { type FormattedDrinkType } from "@/app/drinks/_actions/getAllAvailableDrinkAction";
import { type FormattedPastaType } from "@/app/pastas/_actions/getAllAvailablePastaAction";
import { type FormattedPizzaType } from "@/app/pizzas/_actions/getAllAvailablePizzaAction";
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
  menu: FormattedDrinkType | FormattedPastaType | FormattedPizzaType;
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
      variant="default"
      className="w-full"
      disabled={isLoading}
      onClick={handleAddToCart}
    >
      {isAlreadyInCart ? "Eltávolítás a kosárból" : "Hozzáadás a kosárhoz"}
    </Button>
  );
}
