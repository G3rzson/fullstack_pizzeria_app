import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import DashboardHeader from "./DashboardHeader";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/dashboard/pizzas"),
}));

vi.mock("../_constants/deshboardNavLinks", () => ({
  DASHBOARD_NAV_LINKS: [
    { href: "/dashboard/pizzas", title: "Pizzak" },
    { href: "/dashboard/drinks", title: "Uditok" },
  ],
}));

vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-menu">{children}</div>
  ),
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuItem: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

import { usePathname } from "next/navigation";

const mockUsePathname = usePathname as unknown as Mock;

describe("DashboardHeader component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders dashboard navigation links for desktop and mobile", () => {
    mockUsePathname.mockReturnValue("/dashboard/pizzas");

    render(<DashboardHeader />);

    expect(screen.getAllByRole("link", { name: "Pizzak" })).toHaveLength(2);
    expect(screen.getAllByRole("link", { name: "Uditok" })).toHaveLength(2);
  });

  it("applies active class to current desktop and mobile links", () => {
    mockUsePathname.mockReturnValue("/dashboard/pizzas");

    render(<DashboardHeader />);

    const pizzaLinks = screen.getAllByRole("link", { name: "Pizzak" });
    const drinkLinks = screen.getAllByRole("link", { name: "Uditok" });

    expect(pizzaLinks[0]).toHaveClass("active");
    expect(pizzaLinks[1]).toHaveClass("active");
    expect(drinkLinks[0]).not.toHaveClass("active");
    expect(drinkLinks[1]).not.toHaveClass("active");
  });

  it("renders mobile menu trigger button", () => {
    mockUsePathname.mockReturnValue("/dashboard/drinks");

    render(<DashboardHeader />);

    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByTestId("dropdown-menu")).toBeInTheDocument();
  });
});
