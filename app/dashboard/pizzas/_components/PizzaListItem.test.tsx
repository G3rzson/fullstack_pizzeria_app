import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AdminPizzaDtoType } from "@/shared/Types/types";

vi.mock("@/lib/claudinary/generateBlurUrl", () => ({
  generateBlurUrl: vi.fn(() => "data:image/png;base64,blur"),
}));

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

vi.mock("./ChangePizzaMenuStateBtn", () => ({
  default: ({
    id,
    isAvailableOnMenu,
  }: {
    id: string;
    isAvailableOnMenu: boolean;
  }) => (
    <button data-testid="change-menu-btn">
      change:{id}:{String(isAvailableOnMenu)}
    </button>
  ),
}));

vi.mock("./DeletePizzaBtn", () => ({
  default: ({ id, publicId }: { id: string; publicId: string | null }) => (
    <button data-testid="delete-btn">
      delete:{id}:{publicId ?? "null"}
    </button>
  ),
}));

vi.mock("@/shared/Components/MenuNavLink", () => ({
  default: ({ href, title }: { href: string; title: string }) => (
    <a href={href} data-testid="menu-nav-link">
      {title}
    </a>
  ),
}));

import PizzaListItem from "./PizzaListItem";

const pizzaWithoutImage: AdminPizzaDtoType = {
  id: "p1",
  pizzaName: "margherita",
  pizzaPrice32: 2000,
  pizzaPrice45: 3000,
  pizzaDescription: "classic",
  isAvailableOnMenu: true,
  image: null,
};

const pizzaWithImage: AdminPizzaDtoType = {
  id: "p2",
  pizzaName: "pepperoni",
  pizzaPrice32: 2300,
  pizzaPrice45: 3400,
  pizzaDescription: "spicy",
  isAvailableOnMenu: false,
  image: {
    id: "img1",
    pizzaId: "p2",
    publicId: "cloud-id",
    publicUrl: "https://img.url/pizza.png",
    originalName: "pizza.png",
  },
};

describe("PizzaListItem component", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders pizza name, prices and description", () => {
    render(<PizzaListItem pizza={pizzaWithoutImage} />);

    expect(screen.getByText("margherita")).toBeInTheDocument();
    expect(screen.getByText(/2000/)).toBeInTheDocument();
    expect(screen.getByText(/3000/)).toBeInTheDocument();
    expect(screen.getByText("classic")).toBeInTheDocument();
  });

  it("renders 'Elérhető' badge when pizza is on menu", () => {
    render(<PizzaListItem pizza={pizzaWithoutImage} />);

    expect(screen.getByText("Elérhető")).toBeInTheDocument();
  });

  it("renders 'Nem elérhető' badge when pizza is not on menu", () => {
    render(<PizzaListItem pizza={pizzaWithImage} />);

    expect(screen.getByText("Nem elérhető")).toBeInTheDocument();
  });

  it("renders fallback icon when pizza has no image", () => {
    render(<PizzaListItem pizza={pizzaWithoutImage} />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("renders image when pizza has image", () => {
    render(<PizzaListItem pizza={pizzaWithImage} />);

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "https://img.url/pizza.png");
    expect(img).toHaveAttribute("alt", "pepperoni");
  });

  it("passes correct props to ChangePizzaMenuStateBtn", () => {
    render(<PizzaListItem pizza={pizzaWithoutImage} />);

    expect(screen.getByTestId("change-menu-btn")).toHaveTextContent(
      "change:p1:true",
    );
  });

  it("passes correct props to DeletePizzaBtn with no publicId", () => {
    render(<PizzaListItem pizza={pizzaWithoutImage} />);

    expect(screen.getByTestId("delete-btn")).toHaveTextContent(
      "delete:p1:null",
    );
  });

  it("passes publicId to DeletePizzaBtn when image exists", () => {
    render(<PizzaListItem pizza={pizzaWithImage} />);

    expect(screen.getByTestId("delete-btn")).toHaveTextContent(
      "delete:p2:cloud-id",
    );
  });

  it("renders 'Kép feltöltése' nav link when pizza has no image", () => {
    render(<PizzaListItem pizza={pizzaWithoutImage} />);

    const links = screen.getAllByTestId("menu-nav-link");
    const uploadLink = links.find((l) => l.textContent === "Kép feltöltése");
    expect(uploadLink).toBeInTheDocument();
    expect(uploadLink).toHaveAttribute(
      "href",
      "/dashboard/pizzas/image/upload/p1",
    );
  });

  it("renders 'Kép frissítése' nav link when pizza has image", () => {
    render(<PizzaListItem pizza={pizzaWithImage} />);

    const links = screen.getAllByTestId("menu-nav-link");
    const updateLink = links.find((l) => l.textContent === "Kép frissítése");
    expect(updateLink).toBeInTheDocument();
    expect(updateLink).toHaveAttribute(
      "href",
      "/dashboard/pizzas/image/upload/p2",
    );
  });

  it("renders 'Pizza szerkesztése' edit nav link with correct href", () => {
    render(<PizzaListItem pizza={pizzaWithoutImage} />);

    const links = screen.getAllByTestId("menu-nav-link");
    const editLink = links.find((l) => l.textContent === "Pizza szerkesztése");
    expect(editLink).toBeInTheDocument();
    expect(editLink).toHaveAttribute("href", "/dashboard/pizzas/edit/p1");
  });
});
