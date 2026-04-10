import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  saveToLocalStorage,
  loadFromLocalStorage,
  clearLocalStorage,
} from "./localStorage";
import type { CartItemType } from "@/lib/cart/CartContext";

const mockItem: CartItemType = {
  type: "drink",
  product: { id: "1", drinkName: "Cola", drinkPrice: 300, image: null },
  quantity: 1,
};

describe("localStorage utils", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("saveToLocalStorage serializes cart items", () => {
    saveToLocalStorage([mockItem]);
    expect(localStorage.getItem("cartItems")).toBe(JSON.stringify([mockItem]));
  });

  it("loadFromLocalStorage returns parsed saved items", () => {
    saveToLocalStorage([mockItem]);
    expect(loadFromLocalStorage()).toEqual([mockItem]);
  });

  it("loadFromLocalStorage returns empty array when storage is empty", () => {
    expect(loadFromLocalStorage()).toEqual([]);
  });

  it("clearLocalStorage removes cart items", () => {
    saveToLocalStorage([mockItem]);
    clearLocalStorage();
    expect(loadFromLocalStorage()).toEqual([]);
  });

  it("loadFromLocalStorage returns empty array and clears storage when json is invalid", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    localStorage.setItem("cartItems", "{invalid-json");

    expect(loadFromLocalStorage()).toEqual([]);
    expect(localStorage.getItem("cartItems")).toBeNull();
    expect(warnSpy).toHaveBeenCalledWith(
      "Invalid cart data in localStorage, resetting cart.",
    );

    warnSpy.mockRestore();
  });
});
