import { describe, it, expect, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { CartProvider } from "./CartContext";
import { useCart } from "./useCart";

vi.mock("@/lib/localStorage/localStorage", () => ({
  loadFromLocalStorage: vi.fn(() => []),
}));

import { loadFromLocalStorage } from "@/lib/localStorage/localStorage";

describe("CartProvider", () => {
  it("loads empty cart and sets loading false", async () => {
    vi.mocked(loadFromLocalStorage).mockReturnValue([]);

    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.cartItems).toEqual([]);
  });

  it("loads saved cart items from localStorage", async () => {
    const saved = [
      {
        type: "drink" as const,
        product: { id: "1", drinkName: "Cola", drinkPrice: 300, image: null },
        quantity: 1,
      },
    ];
    vi.mocked(loadFromLocalStorage).mockReturnValue(saved);

    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.cartItems).toEqual(saved);
  });
});
