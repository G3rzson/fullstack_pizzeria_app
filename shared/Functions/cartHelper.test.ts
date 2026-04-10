import { describe, it, expect } from "vitest";
import {
  getTotalPrice,
  addToMenuArray,
  isMenuItemInCart,
  createCartItem,
} from "./cartHelper";
import type { CartItemType } from "@/lib/cart/CartContext";
import type {
  PizzaDtoType,
  PastaDtoType,
  DrinkDtoType,
} from "@/shared/Types/types";

// Mock products
const mockPizza: PizzaDtoType = {
  id: "1",
  pizzaName: "Margherita",
  pizzaPrice32: 1000,
  pizzaPrice45: 1500,
  pizzaDescription: "Classic pizza",
  image: {
    publicUrl: "/pizza.jpg",
  },
};

const mockPasta: PastaDtoType = {
  id: "2",
  pastaName: "Carbonara",
  pastaPrice: 1200,
  pastaDescription: "Italian pasta",
  image: {
    publicUrl: "/pasta.jpg",
  },
};

const mockDrink: DrinkDtoType = {
  id: "3",
  drinkName: "Cola",
  drinkPrice: 300,
  image: {
    publicUrl: "/drink.jpg",
  },
};

// Typed cart item mocks
const mockPizzaCartItem32: CartItemType = {
  type: "pizza",
  product: mockPizza,
  size: 32,
  quantity: 1,
};

const mockPizzaCartItem45: CartItemType = {
  type: "pizza",
  product: mockPizza,
  size: 45,
  quantity: 1,
};

const mockPastaCartItem: CartItemType = {
  type: "pasta",
  product: mockPasta,
  quantity: 1,
};

const mockDrinkCartItem: CartItemType = {
  type: "drink",
  product: mockDrink,
  quantity: 1,
};

describe("getTotalPrice", () => {
  it("should return 0 for empty cart", () => {
    expect(getTotalPrice([])).toBe(0);
  });

  it("should calculate total price for pizza items", () => {
    const cartItems: CartItemType[] = [
      { ...mockPizzaCartItem32, quantity: 2 },
      mockPizzaCartItem45,
    ];
    expect(getTotalPrice(cartItems)).toBe(2000 + 1500);
  });

  it("should calculate total price for mixed items", () => {
    const cartItems: CartItemType[] = [
      mockPizzaCartItem32,
      mockPastaCartItem,
      { ...mockDrinkCartItem, quantity: 2 },
    ];
    expect(getTotalPrice(cartItems)).toBe(1000 + 1200 + 600);
  });
});

describe("addToMenuArray", () => {
  it("should add item to empty cart", () => {
    const result = addToMenuArray([], mockPizzaCartItem32);
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(mockPizzaCartItem32);
  });

  it("should add item to existing cart", () => {
    const cartItems: CartItemType[] = [mockDrinkCartItem];
    const result = addToMenuArray(cartItems, mockPastaCartItem);
    expect(result).toHaveLength(2);
    expect(result[1]).toBe(mockPastaCartItem);
  });
});

describe("isMenuItemInCart", () => {
  it("should return true for pizza with matching size", () => {
    const cartItems: CartItemType[] = [mockPizzaCartItem32];
    expect(isMenuItemInCart(cartItems, mockPizzaCartItem32)).toBe(true);
  });

  it("should return false for pizza with different size", () => {
    const cartItems: CartItemType[] = [mockPizzaCartItem32];
    expect(isMenuItemInCart(cartItems, mockPizzaCartItem45)).toBe(false);
  });

  it("should return true for pasta item", () => {
    const cartItems: CartItemType[] = [mockPastaCartItem];
    expect(isMenuItemInCart(cartItems, mockPastaCartItem)).toBe(true);
  });

  it("should return false for item not in cart", () => {
    const cartItems: CartItemType[] = [mockDrinkCartItem];
    expect(isMenuItemInCart(cartItems, mockPastaCartItem)).toBe(false);
  });
});

describe("createCartItem", () => {
  it("should create pizza cart item with default size", () => {
    const result = createCartItem("pizza", mockPizza);
    expect(result.type).toBe("pizza");
    expect(result.product).toBe(mockPizza);
    if (result.type === "pizza") {
      expect(result.size).toBe(32);
    }
    expect(result.quantity).toBe(1);
  });

  it("should create pizza cart item with specified size", () => {
    const result = createCartItem("pizza", mockPizza, 45);
    expect(result.type).toBe("pizza");
    if (result.type === "pizza") {
      expect(result.size).toBe(45);
    }
  });

  it("should create pasta cart item", () => {
    const result = createCartItem("pasta", mockPasta);
    expect(result.type).toBe("pasta");
    expect(result.product).toBe(mockPasta);
    expect(result.quantity).toBe(1);
  });

  it("should create drink cart item", () => {
    const result = createCartItem("drink", mockDrink);
    expect(result.type).toBe("drink");
    expect(result.product).toBe(mockDrink);
    expect(result.quantity).toBe(1);
  });
});
