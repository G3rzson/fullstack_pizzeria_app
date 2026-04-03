"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { type FormattedDrinkType } from "@/app/drinks/_actions/getAllAvailableDrinkAction";
import { type FormattedPastaType } from "@/app/pastas/_actions/getAllAvailablePastaAction";
import { type pizzaDtoType } from "@/app/pizzas/_actions/getAllAvailablePizzaAction";
import { loadFromLocalStorage } from "@/shared/Functions/localStorage";

export type CartItem =
  | {
      type: "pizza";
      product: pizzaDtoType;
      size: 32 | 45;
      quantity: number;
    }
  | { type: "pasta"; product: FormattedPastaType; quantity: number }
  | { type: "drink"; product: FormattedDrinkType; quantity: number };

type CartContextType = {
  cartItems: CartItem[];
  setCartItems: Dispatch<SetStateAction<CartItem[]>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

export const CartContext = createContext<CartContextType | undefined>(
  undefined,
);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedCartItems = loadFromLocalStorage();
    if (storedCartItems.length > 0) {
      setCartItems(storedCartItems);
    } else {
      setCartItems([]);
    }
    setIsLoading(false);
  }, [setCartItems]);

  return (
    <CartContext.Provider
      value={{ cartItems, setCartItems, isLoading, setIsLoading }}
    >
      {children}
    </CartContext.Provider>
  );
}
