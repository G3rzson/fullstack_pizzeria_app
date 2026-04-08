import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "./LoginForm";
import { loginAction } from "../_actions/loginAction";
import { toast } from "sonner";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";

// Mock loginAction
vi.mock("../_actions/loginAction", () => ({
  loginAction: vi.fn(),
}));

// Mock next/navigation
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  // loginForm uses router.push to navigate after successful login
  useRouter: vi.fn(() => ({
    push: mockPush,
  })),

  // loginForm password field uses it to determine the current path
  usePathname: vi.fn(() => "/auth/login"),
  useSearchParams: vi.fn(() => ({
    get: vi.fn(() => null),
  })),
}));

// Mock useAuth
const mockRefreshUser = vi.fn();
vi.mock("@/lib/auth/useAuth", () => ({
  useAuth: vi.fn(() => ({
    user: null,
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
    refreshUser: mockRefreshUser,
  })),
}));

// Mock toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Get the mocked
const mockLoginAction = loginAction as Mock;
const mockToastSuccess = toast.success as Mock;

describe("Form Submission", () => {
  beforeEach(() => {
    // Clear all mocks before each test to ensure test isolation
    vi.clearAllMocks();
  });

  it("should successfully submit form with valid data", async () => {
    const user = userEvent.setup();
    mockLoginAction.mockResolvedValue({
      success: true,
      message: BACKEND_RESPONSE_MESSAGES.SUCCESS,
    });

    render(<LoginForm />);

    const usernameInput = screen.getByLabelText(/felhasználónév/i);
    const passwordInput = screen.getByLabelText(/jelszó/i);
    const submitButton = screen.getByRole("button", {
      name: /bejelentkezés/i,
    });

    await user.type(usernameInput, "TestUser");
    await user.type(passwordInput, "Password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockLoginAction).toHaveBeenCalledWith({
        username: "TestUser",
        password: "Password123",
      });
    });

    // toast.success
    expect(mockToastSuccess).toHaveBeenCalledWith(
      BACKEND_RESPONSE_MESSAGES.SUCCESS,
    );
    // router.push
    expect(mockPush).toHaveBeenCalledWith("/");
    // reset()
    expect(usernameInput).toHaveValue("");
    expect(passwordInput).toHaveValue("");
  });
});
