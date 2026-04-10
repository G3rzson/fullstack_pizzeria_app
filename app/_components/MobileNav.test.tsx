import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MobileNav from "./MobileNav";

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

// Window.matchMedia is not implemented in jsdom, which is used by testing libraries. Since the Drawer component relies on matchMedia to determine if it should render as a mobile drawer, we need to mock it for our tests to work properly.
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

import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/useAuth";

const mockUsePathname = usePathname as unknown as Mock;
const mockUseAuth = useAuth as unknown as Mock;

describe("MobileNav component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render hamburger menu button", () => {
    mockUsePathname.mockReturnValue("/");

    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
    });

    render(<MobileNav />);

    const menuButton = screen.getByRole("button", { name: /open menu/i });
    expect(menuButton).toBeInTheDocument();
  });

  it("should open drawer and show navigation links", async () => {
    const user = userEvent.setup();
    mockUsePathname.mockReturnValue("/");

    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
    });

    render(<MobileNav />);

    const menuButton = screen.getByRole("button", { name: /open menu/i });
    await user.click(menuButton);

    await waitFor(() => {
      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
    });
  });

  it("should show dashboard link for admin user", async () => {
    const user = userEvent.setup();
    mockUsePathname.mockReturnValue("/");

    mockUseAuth.mockReturnValue({
      user: { role: "ADMIN" },
      isLoading: false,
    });

    render(<MobileNav />);

    const menuButton = screen.getByRole("button", { name: /open menu/i });
    await user.click(menuButton);

    await waitFor(() => {
      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
    });
  });

  it("should show close button in drawer footer", async () => {
    const user = userEvent.setup();
    mockUsePathname.mockReturnValue("/");

    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
    });

    render(<MobileNav />);

    const menuButton = screen.getByRole("button", { name: /open menu/i });
    await user.click(menuButton);

    await waitFor(() => {
      const closeButton = screen.getByRole("button", { name: /close menu/i });
      expect(closeButton).toBeInTheDocument();
    });
  });

  it("should apply active class to current page link", async () => {
    const user = userEvent.setup();
    mockUsePathname.mockReturnValue("/");
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
    });

    render(<MobileNav />);

    const menuButton = screen.getByRole("button", { name: /open menu/i });
    await user.click(menuButton);

    await waitFor(() => {
      const homeLink = screen.getByText("Home").closest("a");
      expect(homeLink).toHaveClass("active");
    });
  });
});
