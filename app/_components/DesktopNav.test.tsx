import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import DesktopNav from "./DesktopNav";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/"),
}));

// Mock useAuth hook
vi.mock("@/lib/auth/useAuth", () => ({
  useAuth: vi.fn(),
}));

// Mock NAV_LINKS constant
vi.mock("../_constants/navLinks", () => ({
  NAV_LINKS: [
    { href: "/", title: "Home" },
    { href: "/dashboard", title: "Dashboard" },
  ],
}));

// Import the mocked functions
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/useAuth";

// Typecast the mocked functions to Mock
const mockUsePathname = usePathname as unknown as Mock;
const mockUseAuth = useAuth as unknown as Mock;

describe("DesktopNav component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render all navigation links for admin user", () => {
    const mockAdminUser = { id: "1", username: "admin", role: "ADMIN" };
    mockUseAuth.mockReturnValue({
      user: mockAdminUser,
      isLoading: false,
    });
    mockUsePathname.mockReturnValue("/");

    render(<DesktopNav />);

    const homeLink = screen.getByRole("link", { name: /home/i });
    const dashboardLink = screen.getByRole("link", { name: /dashboard/i });

    expect(homeLink).toBeInTheDocument();
    expect(dashboardLink).toBeInTheDocument();
  });

  it("should hide dashboard link for non-admin user", () => {
    const mockNonAdminUser = { id: "2", username: "user", role: "USER" };
    mockUseAuth.mockReturnValue({
      user: mockNonAdminUser,
      isLoading: false,
    });
    mockUsePathname.mockReturnValue("/");

    render(<DesktopNav />);

    const homeLink = screen.getByRole("link", { name: /home/i });
    const dashboardLink = screen.queryByRole("link", { name: /dashboard/i });

    expect(homeLink).toBeInTheDocument();
    expect(dashboardLink).not.toBeInTheDocument();
  });

  it("should hide dashboard link when no user is logged in", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
    });
    mockUsePathname.mockReturnValue("/");

    render(<DesktopNav />);

    const homeLink = screen.getByRole("link", { name: /home/i });
    const dashboardLink = screen.queryByRole("link", { name: /dashboard/i });

    expect(homeLink).toBeInTheDocument();
    expect(dashboardLink).not.toBeInTheDocument();
  });

  it("should apply active class to current page link", () => {
    const mockAdminUser = { id: "1", username: "admin", role: "ADMIN" };
    mockUseAuth.mockReturnValue({
      user: mockAdminUser,
      isLoading: false,
    });
    mockUsePathname.mockReturnValue("/");

    render(<DesktopNav />);

    const homeLink = screen.getByRole("link", { name: /home/i });
    expect(homeLink).toHaveClass("active");
  });
});
