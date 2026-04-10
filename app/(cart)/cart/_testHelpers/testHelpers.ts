import { type CartItemType } from "@/lib/cart/CartContext";
import { priceFormatter } from "@/shared/Functions/priceFormatter";

type PizzaItem = Extract<CartItemType, { type: "pizza" }>;
type PastaItem = Extract<CartItemType, { type: "pasta" }>;
type DrinkItem = Extract<CartItemType, { type: "drink" }>;

export function buildPriceRegex(price: number) {
  return new RegExp(
    `^${priceFormatter(price)
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      .replace(/\s+/g, "\\s+")}$`,
  );
}

export function createPizzaItem(options?: {
  id?: string;
  name?: string;
  price32?: number;
  price45?: number;
  size?: 32 | 45;
  quantity?: number;
}): PizzaItem {
  return {
    type: "pizza",
    product: {
      id: options?.id ?? "pizza-1",
      pizzaName: options?.name ?? "Margherita",
      pizzaPrice32: options?.price32 ?? 4000,
      pizzaPrice45: options?.price45 ?? 6000,
      pizzaDescription: "Classic",
      image: null,
    },
    size: options?.size ?? 32,
    quantity: options?.quantity ?? 1,
  };
}

export function createPastaItem(options?: {
  id?: string;
  name?: string;
  price?: number;
  quantity?: number;
}): PastaItem {
  return {
    type: "pasta",
    product: {
      id: options?.id ?? "pasta-1",
      pastaName: options?.name ?? "Spaghetti",
      pastaPrice: options?.price ?? 2200,
      pastaDescription: "Classic",
      image: null,
    },
    quantity: options?.quantity ?? 1,
  };
}

export function createDrinkItem(options?: {
  id?: string;
  name?: string;
  price?: number;
  quantity?: number;
}): DrinkItem {
  return {
    type: "drink",
    product: {
      id: options?.id ?? "drink-1",
      drinkName: options?.name ?? "Cola",
      drinkPrice: options?.price ?? 700,
      image: null,
    },
    quantity: options?.quantity ?? 1,
  };
}
