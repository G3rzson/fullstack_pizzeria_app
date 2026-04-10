import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import Summary from "./Summary";
import {
  buildPriceRegex,
  createDrinkItem,
  createPastaItem,
} from "../_testHelpers/testHelpers";

vi.mock("@/shared/Functions/cartHelper", () => ({
  getTotalPrice: vi.fn(),
}));

vi.mock("@/lib/auth/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/shared/Components/MenuNavLink", () => ({
  default: ({ href, title }: { href: string; title: string }) => (
    <a href={href}>{title}</a>
  ),
}));

import { getTotalPrice } from "@/shared/Functions/cartHelper";
import { useAuth } from "@/lib/auth/useAuth";

const mockGetTotalPrice = getTotalPrice as unknown as Mock;
const mockUseAuth = useAuth as unknown as Mock;

describe("Summary component", () => {
  const cartItems = [
    createPastaItem({ id: "pasta-1", price: 3800, quantity: 2 }),
    createDrinkItem({ id: "drink-1", price: 900, quantity: 1 }),
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders formatted total and checkout link for authenticated user", () => {
    mockUseAuth.mockReturnValue({
      user: { id: "user-123", username: "gergo", role: "USER" },
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
    });
    mockGetTotalPrice.mockReturnValue(8500);

    render(<Summary cartItems={cartItems} />);

    expect(screen.getByText("Végösszeg:")).toBeInTheDocument();
    expect(screen.getByText(buildPriceRegex(8500))).toBeInTheDocument();

    const checkoutLink = screen.getByRole("link", {
      name: "Tovább a fizetéshez",
    });
    expect(checkoutLink).toHaveAttribute("href", "/checkout?user=user-123");

    expect(mockGetTotalPrice).toHaveBeenCalledWith(cartItems);
  });

  it("renders guest checkout link when there is no authenticated user", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
    });
    mockGetTotalPrice.mockReturnValue(8500);

    render(<Summary cartItems={cartItems} />);

    expect(
      screen.getByRole("link", { name: "Tovább a fizetéshez" }),
    ).toHaveAttribute("href", "/checkout?user=guest");
  });
});
