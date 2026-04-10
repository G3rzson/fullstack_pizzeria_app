import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AdminPastaDtoType } from "@/shared/Types/types";

vi.mock("@/lib/claudinary/generateBlurUrl", () => ({
  generateBlurUrl: vi.fn(() => "data:image/png;base64,blur"),
}));

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

vi.mock("./ChangePastaMenuStateBtn", () => ({
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

vi.mock("./DeletePastaBtn", () => ({
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

import PastaListItem from "./PastaListItem";

const pastaWithoutImage: AdminPastaDtoType = {
  id: "t1",
  pastaName: "carbonara",
  pastaPrice: 2800,
  pastaDescription: "classic creamy",
  isAvailableOnMenu: true,
  image: null,
};

const pastaWithImage: AdminPastaDtoType = {
  id: "t2",
  pastaName: "bolognese",
  pastaPrice: 3000,
  pastaDescription: "tomato and beef",
  isAvailableOnMenu: false,
  image: {
    id: "img1",
    pastaId: "t2",
    publicId: "cloud-id",
    publicUrl: "https://img.url/pasta.png",
    originalName: "pasta.png",
  },
};

describe("PastaListItem component", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders pasta name, price and description", () => {
    render(<PastaListItem pasta={pastaWithoutImage} />);

    expect(screen.getByText("carbonara")).toBeInTheDocument();
    expect(screen.getByText(/2800/)).toBeInTheDocument();
    expect(screen.getByText("classic creamy")).toBeInTheDocument();
  });

  it("renders 'Elérhető' badge when pasta is on menu", () => {
    render(<PastaListItem pasta={pastaWithoutImage} />);

    expect(screen.getByText("Elérhető")).toBeInTheDocument();
  });

  it("renders 'Nem elérhető' badge when pasta is not on menu", () => {
    render(<PastaListItem pasta={pastaWithImage} />);

    expect(screen.getByText("Nem elérhető")).toBeInTheDocument();
  });

  it("renders fallback icon when pasta has no image", () => {
    render(<PastaListItem pasta={pastaWithoutImage} />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("renders image when pasta has image", () => {
    render(<PastaListItem pasta={pastaWithImage} />);

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "https://img.url/pasta.png");
    expect(img).toHaveAttribute("alt", "bolognese");
  });

  it("passes correct props to ChangePastaMenuStateBtn", () => {
    render(<PastaListItem pasta={pastaWithoutImage} />);

    expect(screen.getByTestId("change-menu-btn")).toHaveTextContent(
      "change:t1:true",
    );
  });

  it("passes correct props to DeletePastaBtn with no publicId", () => {
    render(<PastaListItem pasta={pastaWithoutImage} />);

    expect(screen.getByTestId("delete-btn")).toHaveTextContent(
      "delete:t1:null",
    );
  });

  it("passes publicId to DeletePastaBtn when image exists", () => {
    render(<PastaListItem pasta={pastaWithImage} />);

    expect(screen.getByTestId("delete-btn")).toHaveTextContent(
      "delete:t2:cloud-id",
    );
  });

  it("renders 'Kép feltöltése' nav link when pasta has no image", () => {
    render(<PastaListItem pasta={pastaWithoutImage} />);

    const links = screen.getAllByTestId("menu-nav-link");
    const uploadLink = links.find((l) => l.textContent === "Kép feltöltése");
    expect(uploadLink).toBeInTheDocument();
    expect(uploadLink).toHaveAttribute(
      "href",
      "/dashboard/pastas/image/upload/t1",
    );
  });

  it("renders 'Kép frissítése' nav link when pasta has image", () => {
    render(<PastaListItem pasta={pastaWithImage} />);

    const links = screen.getAllByTestId("menu-nav-link");
    const updateLink = links.find((l) => l.textContent === "Kép frissítése");
    expect(updateLink).toBeInTheDocument();
    expect(updateLink).toHaveAttribute(
      "href",
      "/dashboard/pastas/image/upload/t2",
    );
  });

  it("renders 'Tészta szerkesztése' edit nav link with correct href", () => {
    render(<PastaListItem pasta={pastaWithoutImage} />);

    const links = screen.getAllByTestId("menu-nav-link");
    const editLink = links.find((l) => l.textContent === "Tészta szerkesztése");
    expect(editLink).toBeInTheDocument();
    expect(editLink).toHaveAttribute("href", "/dashboard/pastas/edit/t1");
  });
});
