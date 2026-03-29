import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "./LoginForm";
import { loginAction } from "../_actions/loginAction";
import { LOGIN_INFO } from "../_constants/info";
import { toast } from "sonner";

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

  it("should show error toast when login fails with server error", async () => {
    const user = userEvent.setup();
    mockLoginAction.mockResolvedValue({
      success: false,
      message: LOGIN_INFO.serverError,
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

    // toast.error should be called with the error message
    expect(mockToastError).toHaveBeenCalledWith(LOGIN_INFO.serverError);
    // router.push should not be called
    expect(mockPush).not.toHaveBeenCalled();
    // reset() should not be called
    expect(usernameInput).not.toHaveValue("");
    expect(passwordInput).not.toHaveValue("");
  });
});
