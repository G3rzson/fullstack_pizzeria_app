import { describe, it, expect } from "vitest";
import {
  getTotalPrice,
  removeFromMenuArray,
  addToMenuArray,
  isMenuItemInCart,
  createCartItem,
  increaseQuantity,
  decreaseQuantity,
  getItemPrice,
  getProductName,
} from "./cartHelper";
import type { CartItem } from "@/lib/cart/CartContext";
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
const mockPizzaCartItem32: CartItem = {
  type: "pizza",
  product: mockPizza,
  size: 32,
  quantity: 1,
};

const mockPizzaCartItem45: CartItem = {
  type: "pizza",
  product: mockPizza,
  size: 45,
  quantity: 1,
};

const mockPastaCartItem: CartItem = {
  type: "pasta",
  product: mockPasta,
  quantity: 1,
};

const mockDrinkCartItem: CartItem = {
  type: "drink",
  product: mockDrink,
  quantity: 1,
};

describe("getTotalPrice", () => {
  it("should return 0 for empty cart", () => {
    expect(getTotalPrice([])).toBe(0);
  });

  it("should calculate total price for pizza items", () => {
    const cartItems: CartItem[] = [
      { ...mockPizzaCartItem32, quantity: 2 },
      mockPizzaCartItem45,
    ];
    expect(getTotalPrice(cartItems)).toBe(2000 + 1500);
  });

  it("should calculate total price for mixed items", () => {
    const cartItems: CartItem[] = [
      mockPizzaCartItem32,
      mockPastaCartItem,
      { ...mockDrinkCartItem, quantity: 2 },
    ];
    expect(getTotalPrice(cartItems)).toBe(1000 + 1200 + 600);
  });
});

describe("removeFromMenuArray", () => {
  it("should remove pizza item with specific size", () => {
    const cartItems: CartItem[] = [mockPizzaCartItem32, mockPizzaCartItem45];
    const result = removeFromMenuArray(cartItems, mockPizzaCartItem32);
    expect(result).toHaveLength(1);
    expect(result[0].type === "pizza" && result[0].size).toBe(45);
  });

  it("should remove pasta item", () => {
    const cartItems: CartItem[] = [mockPastaCartItem, mockDrinkCartItem];
    const result = removeFromMenuArray(cartItems, mockPastaCartItem);
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("drink");
  });

  it("should not remove item if not found", () => {
    const cartItems: CartItem[] = [mockDrinkCartItem];
    const result = removeFromMenuArray(cartItems, mockPastaCartItem);
    expect(result).toHaveLength(1);
  });
});

describe("addToMenuArray", () => {
  it("should add item to empty cart", () => {
    const result = addToMenuArray([], mockPizzaCartItem32);
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(mockPizzaCartItem32);
  });

  it("should add item to existing cart", () => {
    const cartItems: CartItem[] = [mockDrinkCartItem];
    const result = addToMenuArray(cartItems, mockPastaCartItem);
    expect(result).toHaveLength(2);
    expect(result[1]).toBe(mockPastaCartItem);
  });
});

describe("isMenuItemInCart", () => {
  it("should return true for pizza with matching size", () => {
    const cartItems: CartItem[] = [mockPizzaCartItem32];
    expect(isMenuItemInCart(cartItems, mockPizzaCartItem32)).toBe(true);
  });

  it("should return false for pizza with different size", () => {
    const cartItems: CartItem[] = [mockPizzaCartItem32];
    expect(isMenuItemInCart(cartItems, mockPizzaCartItem45)).toBe(false);
  });

  it("should return true for pasta item", () => {
    const cartItems: CartItem[] = [mockPastaCartItem];
    expect(isMenuItemInCart(cartItems, mockPastaCartItem)).toBe(true);
  });

  it("should return false for item not in cart", () => {
    const cartItems: CartItem[] = [mockDrinkCartItem];
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

describe("increaseQuantity", () => {
  it("should increase quantity for matching pizza", () => {
    const cartItems: CartItem[] = [mockPizzaCartItem32];
    const result = increaseQuantity(cartItems, mockPizzaCartItem32);
    expect(result[0].quantity).toBe(2);
  });

  it("should not increase quantity for different size pizza", () => {
    const cartItems: CartItem[] = [mockPizzaCartItem32];
    const result = increaseQuantity(cartItems, mockPizzaCartItem45);
    expect(result[0].quantity).toBe(1);
  });

  it("should increase quantity for pasta", () => {
    const cartItems: CartItem[] = [{ ...mockPastaCartItem, quantity: 2 }];
    const result = increaseQuantity(cartItems, mockPastaCartItem);
    expect(result[0].quantity).toBe(3);
  });
});

describe("decreaseQuantity", () => {
  it("should decrease quantity for matching item", () => {
    const cartItems: CartItem[] = [{ ...mockPizzaCartItem32, quantity: 3 }];
    const result = decreaseQuantity(cartItems, mockPizzaCartItem32);
    expect(result[0].quantity).toBe(2);
  });

  it("should not decrease below 1", () => {
    const cartItems: CartItem[] = [mockPastaCartItem];
    const result = decreaseQuantity(cartItems, mockPastaCartItem);
    expect(result[0].quantity).toBe(1);
  });

  it("should not decrease quantity for different pizza size", () => {
    const cartItems: CartItem[] = [{ ...mockPizzaCartItem45, quantity: 2 }];
    const result = decreaseQuantity(cartItems, mockPizzaCartItem32);
    expect(result[0].quantity).toBe(2);
  });
});

describe("getItemPrice", () => {
  it("should return correct price for 32cm pizza", () => {
    expect(getItemPrice(mockPizzaCartItem32)).toBe(1000);
  });

  it("should return correct price for 45cm pizza", () => {
    expect(getItemPrice(mockPizzaCartItem45)).toBe(1500);
  });

  it("should return correct price for pasta", () => {
    expect(getItemPrice(mockPastaCartItem)).toBe(1200);
  });

  it("should return correct price for drink", () => {
    expect(getItemPrice(mockDrinkCartItem)).toBe(300);
  });
});

describe("getProductName", () => {
  it("should return pizza name", () => {
    expect(getProductName(mockPizzaCartItem32)).toBe("Margherita");
  });

  it("should return pasta name", () => {
    expect(getProductName(mockPastaCartItem)).toBe("Carbonara");
  });

  it("should return drink name", () => {
    expect(getProductName(mockDrinkCartItem)).toBe("Cola");
  });
});
