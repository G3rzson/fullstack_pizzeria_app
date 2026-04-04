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

// Mock toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Get the mocked
const mockLoginAction = loginAction as Mock;
const mockToastError = toast.error as Mock;

describe("Form Submission", () => {
  beforeEach(() => {
    // Clear all mocks before each test to ensure test isolation
    vi.clearAllMocks();
  });

  it("should show error toast for validation error", async () => {
    const user = userEvent.setup();
    mockLoginAction.mockResolvedValue({
      success: false,
      message: BACKEND_RESPONSE_MESSAGES.INVALID_DATA,
    });

    render(<LoginForm />);

    const usernameInput = screen.getByLabelText(/felhasználónév/i);
    const passwordInput = screen.getByLabelText(/jelszó/i);
    const submitButton = screen.getByRole("button", {
      name: /bejelentkezés/i,
    });

    await user.type(usernameInput, "InvalidUser");
    await user.type(passwordInput, "InvalidPassword123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockLoginAction).toHaveBeenCalledWith({
        username: "InvalidUser",
        password: "InvalidPassword123",
      });
    });

    // toast.error should be called with the error message
    expect(mockToastError).toHaveBeenCalledWith(
      BACKEND_RESPONSE_MESSAGES.INVALID_DATA,
    );
    // router.push should not be called
    expect(mockPush).not.toHaveBeenCalled();
    // reset() should not be called
    expect(usernameInput).not.toHaveValue("");
    expect(passwordInput).not.toHaveValue("");
  });
});
