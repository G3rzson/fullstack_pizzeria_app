import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UserMenu from "./UserMenu";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}));

vi.mock("@/lib/auth/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
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

vi.mock("../loading", () => ({
  default: () => <div>Loading...</div>,
}));

import { useAuth } from "@/lib/auth/useAuth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const mockUseAuth = useAuth as Mock;
const mockPush = vi.fn();

describe("UserMenu", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({ push: mockPush });
  });

  it("shows loading state", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: true,
      logout: vi.fn(),
    });

    render(<UserMenu />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows login and register links when logged out", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
      logout: vi.fn(),
    });

    render(<UserMenu />);

    expect(
      screen.getByRole("link", { name: /bejelentkezés/i }),
    ).toHaveAttribute("href", "/auth/login");
    expect(screen.getByRole("link", { name: /regisztráció/i })).toHaveAttribute(
      "href",
      "/auth/register",
    );
  });

  it("logs out successfully", async () => {
    const user = userEvent.setup();
    const logout = vi.fn();
    mockUseAuth.mockReturnValue({
      user: { id: "1", username: "adam", role: "USER" },
      isLoading: false,
      logout,
    });

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: "Sikeres kijelentkezés" }),
      } as Response),
    );

    render(<UserMenu />);

    await user.click(screen.getByRole("button", { name: /kijelentkezés/i }));

    expect(logout).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("shows toast error when logout request fails", async () => {
    const user = userEvent.setup();
    mockUseAuth.mockReturnValue({
      user: { id: "1", username: "adam", role: "USER" },
      isLoading: false,
      logout: vi.fn(),
    });

    global.fetch = vi.fn(() => Promise.resolve({ ok: false } as Response));

    render(<UserMenu />);

    await user.click(screen.getByRole("button", { name: /kijelentkezés/i }));

    expect(toast.error).toHaveBeenCalledWith(
      "Hiba történt a kijelentkezés során",
    );
  });
});
