import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddToCartBtn from "./AddToCartBtn";

vi.mock("@/lib/cart/useCart", () => ({
  useCart: vi.fn(),
}));

vi.mock("@/shared/Functions/cartHelper", () => ({
  createCartItem: vi.fn(),
  isMenuItemInCart: vi.fn(),
  addToMenuArray: vi.fn(),
  removeFromMenuArray: vi.fn(),
}));

vi.mock("@/lib/localStorage/localStorage", () => ({
  saveToLocalStorage: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { useCart } from "@/lib/cart/useCart";
import {
  createCartItem,
  isMenuItemInCart,
  addToMenuArray,
  removeFromMenuArray,
} from "@/shared/Functions/cartHelper";
import { saveToLocalStorage } from "@/lib/localStorage/localStorage";
import { toast } from "sonner";

const menu = {
  id: "p1",
  pizzaName: "Margherita",
  pizzaPrice32: 2000,
  pizzaPrice45: 3000,
  pizzaDescription: "Classic",
  image: null,
};

describe("AddToCartBtn", () => {
  const setCartItems = vi.fn();
  const setIsLoading = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useCart).mockReturnValue({
      cartItems: [],
      setCartItems,
      isLoading: false,
      setIsLoading,
    });
    vi.mocked(createCartItem).mockReturnValue({
      type: "pizza",
      product: menu,
      size: 32,
      quantity: 1,
    });
    vi.mocked(isMenuItemInCart).mockReturnValue(false);
    vi.mocked(addToMenuArray).mockReturnValue([
      { type: "pizza", product: menu, size: 32, quantity: 1 },
    ]);
    vi.mocked(removeFromMenuArray).mockReturnValue([]);
  });

  it("renders add label when item is not in cart", () => {
    render(<AddToCartBtn menu={menu} type="pizza" size={32} />);
    expect(
      screen.getByRole("button", { name: /hozzáadás a kosárhoz/i }),
    ).toBeInTheDocument();
  });

  it("adds item to cart on click", async () => {
    const user = userEvent.setup();
    render(<AddToCartBtn menu={menu} type="pizza" size={32} />);

    await user.click(screen.getByRole("button", { name: /hozzáadás/i }));

    expect(addToMenuArray).toHaveBeenCalled();
    expect(saveToLocalStorage).toHaveBeenCalled();
    expect(setCartItems).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith(
      "Sikeresen hozzáadva a kosárhoz!",
    );
  });

  it("removes item from cart when already in cart", async () => {
    const user = userEvent.setup();
    vi.mocked(isMenuItemInCart).mockReturnValue(true);

    render(<AddToCartBtn menu={menu} type="pizza" size={32} />);

    await user.click(
      screen.getByRole("button", { name: /eltávolítás a kosárból/i }),
    );

    expect(removeFromMenuArray).toHaveBeenCalled();
    expect(saveToLocalStorage).toHaveBeenCalled();
    expect(setCartItems).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith(
      "Sikeresen eltávolítva a kosárból!",
    );
  });

  it("shows error toast when operation throws", async () => {
    const user = userEvent.setup();
    vi.mocked(addToMenuArray).mockImplementation(() => {
      throw new Error("boom");
    });

    render(<AddToCartBtn menu={menu} type="pizza" size={32} />);

    await user.click(screen.getByRole("button", { name: /hozzáadás/i }));

    expect(toast.error).toHaveBeenCalledWith(
      "Hiba történt a kosárhoz adás során! Próbáld újra később.",
    );
  });
});
