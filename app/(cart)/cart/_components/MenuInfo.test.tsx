import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import MenuInfo from "./MenuInfo";
import {
  buildPriceRegex,
  createPastaItem,
  createPizzaItem,
} from "../_testHelpers/testHelpers";

vi.mock("../_functions/getItemPrice", () => ({
  getItemPrice: vi.fn(),
}));

vi.mock("../_functions/getProductName", () => ({
  getProductName: vi.fn(),
}));

import { getItemPrice } from "../_functions/getItemPrice";
import { getProductName } from "../_functions/getProductName";

const mockGetItemPrice = getItemPrice as unknown as Mock;
const mockGetProductName = getProductName as unknown as Mock;

describe("MenuInfo component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders formatted name and price for pasta without size", () => {
    const pastaItem = createPastaItem({ name: "spaghetti", price: 3800 });
    mockGetProductName.mockReturnValue("sPaGhEtTi");
    mockGetItemPrice.mockReturnValue(3800);

    render(<MenuInfo item={pastaItem} />);

    expect(
      screen.getByRole("heading", { level: 3, name: "Spaghetti" }),
    ).toBeInTheDocument();
    expect(screen.getByText(buildPriceRegex(3800))).toBeInTheDocument();
    expect(screen.queryByText(/Méret:/)).not.toBeInTheDocument();

    expect(mockGetProductName).toHaveBeenCalledWith(pastaItem);
    expect(mockGetItemPrice).toHaveBeenCalledWith(pastaItem);
  });

  it("renders pizza size when item type is pizza", () => {
    const pizzaItem = createPizzaItem({ size: 45 });
    mockGetProductName.mockReturnValue("margherita");
    mockGetItemPrice.mockReturnValue(6000);

    render(<MenuInfo item={pizzaItem} />);

    expect(screen.getByText("Méret: 45 cm")).toBeInTheDocument();
    expect(screen.getByText(buildPriceRegex(6000))).toBeInTheDocument();
  });
});
