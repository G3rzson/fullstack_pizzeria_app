import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import CartList from "./CartList";
import { createDrinkItem, createPastaItem } from "../_testHelpers/testHelpers";

const componentMocks = vi.hoisted(() => ({
  Loading: vi.fn(() => <div data-testid="loading">loading</div>),
  EmptyList: vi.fn(({ text }: { text: string }) => (
    <div data-testid="empty-list">{text}</div>
  )),
  CartItem: vi.fn(({ item }: { item: { product: { id: string } } }) => (
    <div data-testid="cart-item">item:{item.product.id}</div>
  )),
  Summary: vi.fn(
    ({ cartItems }: { cartItems: Array<{ product: { id: string } }> }) => (
      <div data-testid="summary">summary:{cartItems.length}</div>
    ),
  ),
}));

vi.mock("@/lib/cart/useCart", () => ({
  useCart: vi.fn(),
}));

vi.mock("@/app/loading", () => ({
  default: componentMocks.Loading,
}));

vi.mock("@/shared/Components/EmptyList", () => ({
  default: componentMocks.EmptyList,
}));

vi.mock("./CartItem", () => ({
  default: componentMocks.CartItem,
}));

vi.mock("./Summary", () => ({
  default: componentMocks.Summary,
}));

import { useCart } from "@/lib/cart/useCart";

const mockUseCart = useCart as unknown as Mock;

describe("CartList component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state when cart is loading", () => {
    mockUseCart.mockReturnValue({
      cartItems: [],
      isLoading: true,
      setCartItems: vi.fn(),
      setIsLoading: vi.fn(),
    });

    render(<CartList />);

    expect(screen.getByTestId("loading")).toBeInTheDocument();
    expect(screen.queryByTestId("empty-list")).not.toBeInTheDocument();
    expect(screen.queryByTestId("summary")).not.toBeInTheDocument();
  });

  it("renders empty list state when cart is not loading and empty", () => {
    mockUseCart.mockReturnValue({
      cartItems: [],
      isLoading: false,
      setCartItems: vi.fn(),
      setIsLoading: vi.fn(),
    });

    render(<CartList />);

    expect(screen.getByTestId("empty-list")).toHaveTextContent(
      "A kosarad üres!",
    );
    expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
    expect(screen.queryByTestId("summary")).not.toBeInTheDocument();
  });

  it("renders cart items and summary when cart has items", () => {
    const cartItems = [
      createPastaItem({ id: "pasta-1", quantity: 2 }),
      createDrinkItem({ id: "drink-1", quantity: 1 }),
    ];

    mockUseCart.mockReturnValue({
      cartItems,
      isLoading: false,
      setCartItems: vi.fn(),
      setIsLoading: vi.fn(),
    });

    render(<CartList />);

    const items = screen.getAllByTestId("cart-item");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("item:pasta-1");
    expect(items[1]).toHaveTextContent("item:drink-1");
    expect(screen.getByTestId("summary")).toHaveTextContent("summary:2");

    expect(componentMocks.CartItem).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ item: cartItems[0] }),
      undefined,
    );
    expect(componentMocks.CartItem).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ item: cartItems[1] }),
      undefined,
    );
    expect(componentMocks.Summary).toHaveBeenCalledWith(
      expect.objectContaining({ cartItems }),
      undefined,
    );
  });
});
