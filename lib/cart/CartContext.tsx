"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  type PizzaDtoType,
  type PastaDtoType,
  type DrinkDtoType,
} from "@/shared/Types/types";
import { loadFromLocalStorage } from "@/lib/localStorage/localStorage";

export type CartItemType =
  | {
      type: "pizza";
      product: PizzaDtoType;
      size: 32 | 45;
      quantity: number;
    }
  | { type: "pasta"; product: PastaDtoType; quantity: number }
  | { type: "drink"; product: DrinkDtoType; quantity: number };

type CartContextType = {
  cartItems: CartItemType[];
  setCartItems: Dispatch<SetStateAction<CartItemType[]>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

export const CartContext = createContext<CartContextType | undefined>(
  undefined,
);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
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
