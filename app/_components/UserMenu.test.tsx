import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import { CartProvider } from "@/lib/cart/CartContext";
import userEvent from "@testing-library/user-event";
import UserMenu from "./UserMenu";

// Mock next/navigation dependency
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}));

// Mock useAuth hook
vi.mock("@/lib/auth/useAuth", () => ({
  useAuth: vi.fn(),
}));

// Import the mocked useAuth function
import { useAuth } from "@/lib/auth/useAuth";

// Typecast the mocked useAuth function to Mock
const mockUseAuth = useAuth as unknown as Mock;

describe("UserMenu component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading UI when auth state is loading", async () => {
    const user = userEvent.setup();

    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: true,
    });

    render(
      <CartProvider>
        <UserMenu />
      </CartProvider>,
    );

    await user.click(
      screen.getByRole("button", { name: /felhasználói menü/i }),
    );

    expect(
      await screen.findByLabelText(/felhasználó betöltése/i),
    ).toBeInTheDocument();
  });

  it("shows username and logout action for authenticated user", async () => {
    const user = userEvent.setup();

    mockUseAuth.mockReturnValue({
      user: { id: "1", username: "gergo", role: "USER" },
      isLoading: false,
      logout: vi.fn(),
    });

    render(
      <CartProvider>
        <UserMenu />
      </CartProvider>,
    );

    await user.click(
      screen.getByRole("button", { name: /felhasználói menü/i }),
    );

    expect(await screen.findByText("gergo")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /kijelentkezés/i }),
    ).toBeInTheDocument();
  });

  it("shows login and register links for unauthenticated user", async () => {
    const user = userEvent.setup();

    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
      logout: vi.fn(),
    });

    render(
      <CartProvider>
        <UserMenu />
      </CartProvider>,
    );

    await user.click(
      screen.getByRole("button", { name: /felhasználói menü/i }),
    );

    const loginLink = await screen.findByText(/bejelentkezés/i);
    const registerLink = screen.getByText(/regisztráció/i);

    expect(loginLink).toHaveAttribute("href", "/auth/login");
    expect(registerLink).toHaveAttribute("href", "/auth/register");
  });
});
