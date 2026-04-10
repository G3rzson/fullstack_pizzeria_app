import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CartFnBtn from "./CartFnBtn";
import { createPastaItem } from "../_testHelpers/testHelpers";

vi.mock("@/lib/cart/useCart", () => ({
  useCart: vi.fn(),
}));

vi.mock("@/lib/localStorage/localStorage", () => ({
  saveToLocalStorage: vi.fn(),
}));

vi.mock("../_functions/increaseQuantity", () => ({
  increaseQuantity: vi.fn(),
}));

vi.mock("../_functions/decreaseQuantity", () => ({
  decreaseQuantity: vi.fn(),
}));

vi.mock("../_functions/removeFromCart", () => ({
  removeFromCart: vi.fn(),
}));

import { useCart } from "@/lib/cart/useCart";
import { saveToLocalStorage } from "@/lib/localStorage/localStorage";
import { increaseQuantity } from "../_functions/increaseQuantity";
import { decreaseQuantity } from "../_functions/decreaseQuantity";
import { removeFromCart } from "../_functions/removeFromCart";

describe("CartFnBtn component", () => {
  const setCartItems = vi.fn();
  const setIsLoading = vi.fn();
  const item = createPastaItem({ id: "pasta-1", quantity: 2 });
  const cartItems = [item];

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useCart).mockReturnValue({
      cartItems,
      setCartItems,
      isLoading: false,
      setIsLoading,
    });
  });

  it("runs increase flow on click", async () => {
    const user = userEvent.setup();
    const updatedCart = [
      createPastaItem({ id: "pasta-1", quantity: 3, price: 2200 }),
    ];
    vi.mocked(increaseQuantity).mockReturnValue(updatedCart);

    render(
      <CartFnBtn item={item} action="increase">
        +
      </CartFnBtn>,
    );

    await user.click(screen.getByRole("button", { name: "+" }));

    expect(increaseQuantity).toHaveBeenCalledWith(cartItems, item);
    expect(setCartItems).toHaveBeenCalledWith(updatedCart);
    expect(saveToLocalStorage).toHaveBeenCalledWith(updatedCart);
    expect(decreaseQuantity).not.toHaveBeenCalled();
    expect(removeFromCart).not.toHaveBeenCalled();
  });

  it("runs decrease flow on click", async () => {
    const user = userEvent.setup();
    const updatedCart = [
      createPastaItem({ id: "pasta-1", quantity: 1, price: 2200 }),
    ];
    vi.mocked(decreaseQuantity).mockReturnValue(updatedCart);

    render(
      <CartFnBtn item={item} action="decrease">
        -
      </CartFnBtn>,
    );

    await user.click(screen.getByRole("button", { name: "-" }));

    expect(decreaseQuantity).toHaveBeenCalledWith(cartItems, item);
    expect(setCartItems).toHaveBeenCalledWith(updatedCart);
    expect(saveToLocalStorage).toHaveBeenCalledWith(updatedCart);
    expect(increaseQuantity).not.toHaveBeenCalled();
    expect(removeFromCart).not.toHaveBeenCalled();
  });

  it("runs remove flow on click", async () => {
    const user = userEvent.setup();
    const updatedCart: typeof cartItems = [];
    vi.mocked(removeFromCart).mockReturnValue(updatedCart);

    render(
      <CartFnBtn item={item} action="remove">
        x
      </CartFnBtn>,
    );

    await user.click(screen.getByRole("button", { name: "x" }));

    expect(removeFromCart).toHaveBeenCalledWith(cartItems, item);
    expect(setCartItems).toHaveBeenCalledWith(updatedCart);
    expect(saveToLocalStorage).toHaveBeenCalledWith(updatedCart);
    expect(increaseQuantity).not.toHaveBeenCalled();
    expect(decreaseQuantity).not.toHaveBeenCalled();
  });
});
