import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MenuListItem from "./MenuListItem";

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

vi.mock("@/lib/claudinary/generateBlurUrl", () => ({
  generateBlurUrl: vi.fn((url: string) => `blur:${url}`),
}));

vi.mock("@/shared/Functions/textFormatter", () => ({
  textFormatter: vi.fn((text: string) => `formatted:${text}`),
}));

vi.mock("@/shared/Functions/priceFormatter", () => ({
  priceFormatter: vi.fn((price: number) => `${price} Ft`),
}));

vi.mock("@/lib/cart/AddToCartBtn", () => ({
  default: ({
    menu,
    type,
    size,
  }: {
    menu: { id: string };
    type: string;
    size?: number;
  }) => (
    <button data-testid="add-to-cart-btn">
      Add {type}:{menu.id}:{size ?? "none"}
    </button>
  ),
}));

const mockDrink = {
  id: "d1",
  drinkName: "Cola",
  drinkPrice: 500,
  image: null,
};

const mockDrinkWithImage = {
  ...mockDrink,
  image: {
    id: "img1",
    drinkId: "d1",
    publicId: "cloud-id",
    originalName: "cola.jpg",
    publicUrl: "https://example.com/cola.jpg",
  },
};

const mockPasta = {
  id: "p1",
  pastaName: "Carbonara",
  pastaPrice: 2500,
  pastaDescription: "Classic creamy pasta",
  image: null,
};

const mockPizza = {
  id: "pz1",
  pizzaName: "Margherita",
  pizzaPrice32: 2000,
  pizzaPrice45: 3000,
  pizzaDescription: "Classic pizza",
  image: null,
};

describe("MenuListItem component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders drink with name, price, and no size selection", () => {
    render(<MenuListItem menuArray={mockDrink} />);

    expect(screen.getByText("formatted:Cola")).toBeInTheDocument();
    expect(screen.getByText("500 Ft")).toBeInTheDocument();
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
  });

  it("renders pasta with name, price, description and no size selection", () => {
    render(<MenuListItem menuArray={mockPasta} />);

    expect(screen.getByText("formatted:Carbonara")).toBeInTheDocument();
    expect(screen.getByText("2500 Ft")).toBeInTheDocument();
    expect(screen.getByText("Classic creamy pasta")).toBeInTheDocument();
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
  });

  it("renders pizza with name, price, description and size selection radio buttons", () => {
    render(<MenuListItem menuArray={mockPizza} />);

    expect(screen.getByText("formatted:Margherita")).toBeInTheDocument();
    expect(screen.getByText("2000 Ft")).toBeInTheDocument();
    expect(screen.getByText("Classic pizza")).toBeInTheDocument();

    const label32 = screen.getByLabelText("32 cm");
    const label45 = screen.getByLabelText("45 cm");
    expect(label32).toBeInTheDocument();
    expect(label45).toBeInTheDocument();
  });

  it("updates price when pizza size is changed", async () => {
    const user = userEvent.setup();
    render(<MenuListItem menuArray={mockPizza} />);

    expect(screen.getByText("2000 Ft")).toBeInTheDocument();

    await user.click(screen.getByLabelText("45 cm"));

    expect(screen.getByText("3000 Ft")).toBeInTheDocument();
  });

  it("renders fallback icon when item has no image", () => {
    const { container } = render(<MenuListItem menuArray={mockDrink} />);

    const svgIcon = container.querySelector("svg");
    expect(svgIcon).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("renders image when item has image", () => {
    render(<MenuListItem menuArray={mockDrinkWithImage} />);

    const img = screen.getByRole("img", { name: "Cola" });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://example.com/cola.jpg");
  });

  it("passes correct drink type and no size to AddToCartBtn", () => {
    render(<MenuListItem menuArray={mockDrink} />);

    expect(screen.getByTestId("add-to-cart-btn")).toHaveTextContent(
      "Add drink:d1:none",
    );
  });

  it("passes correct pasta type and no size to AddToCartBtn", () => {
    render(<MenuListItem menuArray={mockPasta} />);

    expect(screen.getByTestId("add-to-cart-btn")).toHaveTextContent(
      "Add pasta:p1:none",
    );
  });

  it("passes pizza type and default size 32 to AddToCartBtn", () => {
    render(<MenuListItem menuArray={mockPizza} />);

    expect(screen.getByTestId("add-to-cart-btn")).toHaveTextContent(
      "Add pizza:pz1:32",
    );
  });

  it("passes updated size to AddToCartBtn when pizza size changes", async () => {
    const user = userEvent.setup();
    render(<MenuListItem menuArray={mockPizza} />);

    await user.click(screen.getByLabelText("45 cm"));

    expect(screen.getByTestId("add-to-cart-btn")).toHaveTextContent(
      "Add pizza:pz1:45",
    );
  });
});
