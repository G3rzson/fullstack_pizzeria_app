import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterForm from "../_components/RegisterForm";
import { registerAction } from "../_actions/registerAction";
import { REGISTER_INFO } from "../_constants/info";
import { toast } from "sonner";

// Mock registerAction
vi.mock("../_actions/registerAction", () => ({
  registerAction: vi.fn(),
}));

// Mock next/navigation
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  // registerForm uses router.push to navigate after successful registration
  useRouter: vi.fn(() => ({
    push: mockPush,
  })),

  // registerForm password field uses it to determine the current path
  usePathname: vi.fn(() => "/auth/register"),
}));

// Mock toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Get the mocked
const mockRegisterAction = registerAction as Mock;
const mockToastError = toast.error as Mock;

describe("Form Submission", () => {
  beforeEach(() => {
    // Clear all mocks before each test to ensure test isolation
    vi.clearAllMocks();
  });

  it("should show error toast for unexpected error", async () => {
    const user = userEvent.setup();
    mockRegisterAction.mockResolvedValue({
      success: false,
      message: REGISTER_INFO.error,
    });

    render(<RegisterForm />);

    const usernameInput = screen.getByLabelText(/felhasználónév/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/jelszó/i);
    const submitButton = screen.getByRole("button", {
      name: /regisztráció/i,
    });

    await user.type(usernameInput, "unexpectedUser");
    await user.type(emailInput, "unexpected@example.com");
    await user.type(passwordInput, "UnexpectedPwd123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockRegisterAction).toHaveBeenCalledWith({
        username: "unexpectedUser",
        email: "unexpected@example.com",
        password: "UnexpectedPwd123",
      });
    });

    // toast.error should be called with the error message
    expect(mockToastError).toHaveBeenCalledWith(REGISTER_INFO.error);
    // router.push should not be called
    expect(mockPush).not.toHaveBeenCalled();
    // reset() should not be called
    expect(usernameInput).not.toHaveValue("");
    expect(emailInput).not.toHaveValue("");
    expect(passwordInput).not.toHaveValue("");
  });
});
