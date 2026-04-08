import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "./LoginForm";
import { loginAction } from "../_actions/loginAction";

// Mock loginAction
vi.mock("../_actions/loginAction", () => ({
  loginAction: vi.fn(),
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  // registerForm uses router.push to navigate after successful registration
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),

  // registerForm password field uses it to determine the current path
  usePathname: vi.fn(() => "/auth/register"),
  useSearchParams: vi.fn(() => ({
    get: vi.fn(() => null),
  })),
}));

// Mock useAuth
vi.mock("@/lib/auth/useAuth", () => ({
  useAuth: vi.fn(() => ({
    user: null,
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
    refreshUser: vi.fn(),
  })),
}));

const mockLoginAction = loginAction as Mock;

describe("Login Form Render", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the login form", () => {
    render(<LoginForm />);
    expect(
      screen.getByRole("form", { name: /login-form/i }),
    ).toBeInTheDocument();
  });

  it("should render username input with correct type", () => {
    render(<LoginForm />);
    const usernameInput = screen.getByRole("textbox", {
      name: /felhasználónév/i,
    });
    expect(usernameInput).toBeInTheDocument();
    expect(usernameInput).toHaveAttribute("type", "text");
  });

  it("should render password input with correct type", () => {
    render(<LoginForm />);
    const passwordInput = screen.getByLabelText(/jelszó/i);
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("should render register link", () => {
    render(<LoginForm />);
    const registerLink = screen.getByRole("link", { name: /regisztrálj/i });
    expect(registerLink).toBeInTheDocument();
    expect(registerLink).toHaveAttribute("href", "/auth/register");
  });

  it("should allow user to click register link", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const registerLink = screen.getByRole("link", { name: /regisztrálj/i });
    await user.click(registerLink);

    expect(registerLink).toHaveAttribute("href", "/auth/register");
  });

  it("should render login button", () => {
    render(<LoginForm />);
    const submitButton = screen.getByRole("button", { name: /bejelentkezés/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute("type", "submit");
  });

  it("should disable inputs and buttons during submission", async () => {
    const user = userEvent.setup();
    mockLoginAction.mockImplementation(() => new Promise(() => {}));
    render(<LoginForm />);

    const usernameInput = screen.getByLabelText(/felhasználónév/i);
    const passwordInput = screen.getByLabelText(/jelszó/i);
    const submitButton = screen.getByRole("button", { name: /bejelentkezés/i });

    // Fill in the form and submit
    await user.type(usernameInput, "testuser");
    await user.type(passwordInput, "Password1");
    await user.click(submitButton);

    await waitFor(() => {
      expect(usernameInput).toBeDisabled();
      expect(passwordInput).toBeDisabled();
      expect(submitButton).toBeDisabled();
    });
  });
});
