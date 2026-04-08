import { describe, it, expect, beforeEach } from "vitest";
import {
  saveToLocalStorage,
  loadFromLocalStorage,
  clearLocalStorage,
} from "./localStorage";
import type { CartItem } from "@/lib/cart/CartContext";

const mockItem: CartItem = {
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
});
