import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AdminDrinkDtoType } from "@/shared/Types/types";

vi.mock("@/lib/claudinary/generateBlurUrl", () => ({
  generateBlurUrl: vi.fn(() => "data:image/png;base64,blur"),
}));

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

vi.mock("./ChangeDrinkMenuStateBtn", () => ({
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

vi.mock("./DeleteDrinkBtn", () => ({
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

import DrinkListItem from "./DrinkListItem";

const drinkWithoutImage: AdminDrinkDtoType = {
  id: "d1",
  drinkName: "cola",
  drinkPrice: 500,
  isAvailableOnMenu: true,
  image: null,
};

const drinkWithImage: AdminDrinkDtoType = {
  id: "d2",
  drinkName: "fanta",
  drinkPrice: 450,
  isAvailableOnMenu: false,
  image: {
    id: "img1",
    drinkId: "d2",
    publicId: "cloud-id",
    publicUrl: "https://img.url/fanta.png",
    originalName: "fanta.png",
  },
};

describe("DrinkListItem component", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders drink name and price", () => {
    render(<DrinkListItem drink={drinkWithoutImage} />);

    expect(screen.getByText("cola")).toBeInTheDocument();
    expect(screen.getByText(/500/)).toBeInTheDocument();
  });

  it("renders 'Elérhető' badge when drink is on menu", () => {
    render(<DrinkListItem drink={drinkWithoutImage} />);

    expect(screen.getByText("Elérhető")).toBeInTheDocument();
  });

  it("renders 'Nem elérhető' badge when drink is not on menu", () => {
    render(<DrinkListItem drink={drinkWithImage} />);

    expect(screen.getByText("Nem elérhető")).toBeInTheDocument();
  });

  it("renders fallback icon when drink has no image", () => {
    render(<DrinkListItem drink={drinkWithoutImage} />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("renders image when drink has image", () => {
    render(<DrinkListItem drink={drinkWithImage} />);

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "https://img.url/fanta.png");
    expect(img).toHaveAttribute("alt", "fanta");
  });

  it("passes correct props to ChangeDrinkMenuStateBtn", () => {
    render(<DrinkListItem drink={drinkWithoutImage} />);

    expect(screen.getByTestId("change-menu-btn")).toHaveTextContent(
      "change:d1:true",
    );
  });

  it("passes correct props to DeleteDrinkBtn with no publicId", () => {
    render(<DrinkListItem drink={drinkWithoutImage} />);

    expect(screen.getByTestId("delete-btn")).toHaveTextContent(
      "delete:d1:null",
    );
  });

  it("passes publicId to DeleteDrinkBtn when image exists", () => {
    render(<DrinkListItem drink={drinkWithImage} />);

    expect(screen.getByTestId("delete-btn")).toHaveTextContent(
      "delete:d2:cloud-id",
    );
  });

  it("renders 'Kép feltöltése' nav link when drink has no image", () => {
    render(<DrinkListItem drink={drinkWithoutImage} />);

    const links = screen.getAllByTestId("menu-nav-link");
    const uploadLink = links.find((l) => l.textContent === "Kép feltöltése");
    expect(uploadLink).toBeInTheDocument();
    expect(uploadLink).toHaveAttribute(
      "href",
      "/dashboard/drinks/image/upload/d1",
    );
  });

  it("renders 'Kép frissítése' nav link when drink has image", () => {
    render(<DrinkListItem drink={drinkWithImage} />);

    const links = screen.getAllByTestId("menu-nav-link");
    const updateLink = links.find((l) => l.textContent === "Kép frissítése");
    expect(updateLink).toBeInTheDocument();
    expect(updateLink).toHaveAttribute(
      "href",
      "/dashboard/drinks/image/upload/d2",
    );
  });

  it("renders 'Ital szerkesztése' edit nav link with correct href", () => {
    render(<DrinkListItem drink={drinkWithoutImage} />);

    const links = screen.getAllByTestId("menu-nav-link");
    const editLink = links.find((l) => l.textContent === "Ital szerkesztése");
    expect(editLink).toBeInTheDocument();
    expect(editLink).toHaveAttribute("href", "/dashboard/drinks/edit/d1");
  });
});
