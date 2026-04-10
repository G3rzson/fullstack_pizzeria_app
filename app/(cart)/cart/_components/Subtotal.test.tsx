import { describe, it, expect, vi, type Mock, beforeEach } from "vitest";
import Subtotal from "./Subtotal";
import { render, screen } from "@testing-library/react";
import { buildPriceRegex, createPastaItem } from "../_testHelpers/testHelpers";

// mock the getItemPrice function
vi.mock("../_functions/getItemPrice", () => ({
  getItemPrice: vi.fn(),
}));

// import the mocked getItemPrice function
import { getItemPrice } from "../_functions/getItemPrice";

// Typecast the mocked getItemPrice function
const mockGetItemPrice = getItemPrice as unknown as Mock;

const pastaItem = createPastaItem({
  id: "1",
  name: "Spaghetti",
  price: 3800,
  quantity: 2,
});

describe("Subtotal component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calculates and displays the correct subtotal", () => {
    mockGetItemPrice.mockReturnValue(3800);
    render(<Subtotal item={pastaItem} />);

    expect(screen.getByText(buildPriceRegex(3800 * 2))).toBeInTheDocument();
    expect(mockGetItemPrice).toHaveBeenCalledWith(pastaItem);
  });
});
