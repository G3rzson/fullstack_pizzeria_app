import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import DesktopNav from "./DesktopNav";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/pizzas"),
}));

// Mock useAuth
const mockUseAuth = vi.fn();
vi.mock("@/lib/auth/useAuth", () => ({
  useAuth: mockUseAuth,
}));

import { usePathname } from "next/navigation";
const mockUsePathname = usePathname as Mock;

describe("DesktopNav", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render all navigation links for admin user", () => {
    mockUseAuth.mockReturnValue({
      user: { id: "1", username: "admin", role: "ADMIN" },
      isLoading: false,
    });
    mockUsePathname.mockReturnValue("/pizzas");

    render(<DesktopNav />);

    expect(screen.getByText("Pizzák")).toBeInTheDocument();
    expect(screen.getByText("Tészták")).toBeInTheDocument();
    expect(screen.getByText("Üdítők")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("should hide dashboard link for non-admin user", () => {
    mockUseAuth.mockReturnValue({
      user: { id: "2", username: "user", role: "USER" },
      isLoading: false,
    });
    mockUsePathname.mockReturnValue("/pizzas");

    render(<DesktopNav />);

    expect(screen.getByText("Pizzák")).toBeInTheDocument();
    expect(screen.getByText("Tészták")).toBeInTheDocument();
    expect(screen.getByText("Üdítők")).toBeInTheDocument();
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
  });

  it("should hide dashboard link when no user is logged in", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
    });
    mockUsePathname.mockReturnValue("/pizzas");

    render(<DesktopNav />);

    expect(screen.getByText("Pizzák")).toBeInTheDocument();
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
  });

  it("should apply active class to current page link", () => {
    mockUseAuth.mockReturnValue({
      user: { id: "1", username: "admin", role: "ADMIN" },
      isLoading: false,
    });
    mockUsePathname.mockReturnValue("/pizzas");

    render(<DesktopNav />);

    const pizzasLink = screen.getByText("Pizzák").closest("a");
    expect(pizzasLink).toHaveClass("active");
  });
});
