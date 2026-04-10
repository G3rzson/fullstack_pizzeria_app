import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import CartLink from "./CartLink";

// Mock the useCart hook
vi.mock("@/lib/cart/useCart", () => ({
  useCart: vi.fn(),
}));

// Import the mocked useCart hook
import { useCart } from "@/lib/cart/useCart";

describe("CartLink component", () => {
  it("renders cart link", () => {
    vi.mocked(useCart).mockReturnValue({
      cartItems: [],
      setCartItems: vi.fn(),
      isLoading: false,
      setIsLoading: vi.fn(),
    });

    render(<CartLink />);

    const cartLink = screen.getByRole("link", { name: /kosár/i });
    const badge = screen.queryByText(/^\d+$/);

    expect(cartLink).toBeInTheDocument();
    expect(cartLink).toHaveAttribute("href", "/cart");
    expect(badge).not.toBeInTheDocument();
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

    const badge = screen.getByText(/^\d+$/);

    expect(badge).toBeInTheDocument();
  });
});
