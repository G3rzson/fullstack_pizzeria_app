import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import CartLink from "./CartLink";

vi.mock("@/lib/cart/useCart", () => ({
  useCart: vi.fn(),
}));

import { useCart } from "@/lib/cart/useCart";

describe("CartLink", () => {
  it("renders cart link", () => {
    vi.mocked(useCart).mockReturnValue({
      cartItems: [],
      setCartItems: vi.fn(),
      isLoading: false,
      setIsLoading: vi.fn(),
    });

    render(<CartLink />);

    expect(screen.getByRole("link")).toHaveAttribute("href", "/cart");
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  it("renders badge with item count when cart is not empty", () => {
    vi.mocked(useCart).mockReturnValue({
      cartItems: [
        {
          type: "drink",
          product: { id: "1", drinkName: "Cola", drinkPrice: 300, image: null },
          quantity: 1,
        },
      ],
      setCartItems: vi.fn(),
      isLoading: false,
      setIsLoading: vi.fn(),
    });

    render(<CartLink />);

    expect(screen.getByText("1")).toBeInTheDocument();
  });
});
