import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MobileNav from "./MobileNav";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/pizzas"),
}));

import { usePathname } from "next/navigation";
const mockUsePathname = usePathname as Mock;

// Mock matchMedia for Drawer component
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe("MobileNav", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render menu button", () => {
    mockUsePathname.mockReturnValue("/pizzas");

    render(<MobileNav />);

    const menuButton = screen.getByRole("button");
    expect(menuButton).toBeInTheDocument();
  });

  it("should open drawer and show navigation links", async () => {
    const user = userEvent.setup();
    mockUsePathname.mockReturnValue("/pizzas");

    render(<MobileNav />);

    const menuButton = screen.getByRole("button");
    await user.click(menuButton);

    await waitFor(() => {
      expect(screen.getByText("Pizzák")).toBeInTheDocument();
      expect(screen.getByText("Tészták")).toBeInTheDocument();
      expect(screen.getByText("Üdítők")).toBeInTheDocument();
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
    });
  });

  it("should show logo in drawer header", async () => {
    const user = userEvent.setup();
    mockUsePathname.mockReturnValue("/pizzas");

    render(<MobileNav />);

    const menuButton = screen.getByRole("button");
    await user.click(menuButton);

    await waitFor(() => {
      const logo = screen.getByAltText("Logo");
      expect(logo).toBeInTheDocument();
    });
  });

  it("should apply active class to current page link", async () => {
    const user = userEvent.setup();
    mockUsePathname.mockReturnValue("/pizzas");

    render(<MobileNav />);

    const menuButton = screen.getByRole("button");
    await user.click(menuButton);

    await waitFor(() => {
      const pizzasLink = screen.getByText("Pizzák").closest("a");
      expect(pizzasLink).toHaveClass("active");
    });
  });
});
