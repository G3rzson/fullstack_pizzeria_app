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
const mockToastSuccess = toast.success as Mock;

describe("Form Submission", () => {
  beforeEach(() => {
    // Clear all mocks before each test to ensure test isolation
    vi.clearAllMocks();
  });

  it("should successfully submit form with valid data", async () => {
    const user = userEvent.setup();
    mockRegisterAction.mockResolvedValue({
      success: true,
      message: REGISTER_INFO.success,
    });

    render(<RegisterForm />);

    const usernameInput = screen.getByLabelText(/felhasználónév/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/jelszó/i);
    const submitButton = screen.getByRole("button", {
      name: /regisztráció/i,
    });

    await user.type(usernameInput, "TestUser");
    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "Password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockRegisterAction).toHaveBeenCalledWith({
        username: "TestUser",
        email: "test@example.com",
        password: "Password123",
      });
    });

    // toast.success
    expect(mockToastSuccess).toHaveBeenCalledWith(REGISTER_INFO.success);
    // router.push
    expect(mockPush).toHaveBeenCalledWith("/auth/login");
    // reset()
    expect(usernameInput).toHaveValue("");
    expect(emailInput).toHaveValue("");
    expect(passwordInput).toHaveValue("");
  });
});
