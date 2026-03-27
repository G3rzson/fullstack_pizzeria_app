import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterForm from "./RegisterForm";
import { registerAction } from "../_actions/registerAction";
import { toast } from "sonner";
import { REGISTER_INFO } from "../_constants/info";

// todo: fix the tests

// Mock next/navigation with vi.hoisted
const { mockPush, mockUseRouter, mockUsePathname } = vi.hoisted(() => {
  const push = vi.fn();
  return {
    mockPush: push,
    mockUseRouter: vi.fn(() => ({
      push: push,
    })),
    mockUsePathname: vi.fn(() => "/auth/register"),
  };
});

vi.mock("next/navigation", () => ({
  useRouter: mockUseRouter,
  usePathname: mockUsePathname,
}));

// Mock registerAction
vi.mock("../_actions/registerAction", () => ({
  registerAction: vi.fn(),
}));

// Mock toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockRegisterAction = registerAction as Mock;
const mockToastSuccess = toast.success as Mock;
const mockToastError = toast.error as Mock;

describe("RegisterForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render all form fields", () => {
      render(<RegisterForm />);

      expect(screen.getByLabelText(/felhasználónév/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/jelszó/i)).toBeInTheDocument();
    });

    it("should render registration button", () => {
      render(<RegisterForm />);

      expect(
        screen.getByRole("button", { name: /regisztráció/i }),
      ).toBeInTheDocument();
    });

    it("should render login link", () => {
      render(<RegisterForm />);

      const loginLink = screen.getByRole("link", { name: /jelentkezz be/i });
      expect(loginLink).toBeInTheDocument();
      expect(loginLink).toHaveAttribute("href", "/auth/login");
    });

    it("should render card with title and description", () => {
      render(<RegisterForm />);

      expect(
        screen.getByRole("heading", { name: /regisztráció/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/a \*-al jelölt mezők kitöltése kötelező/i),
      ).toBeInTheDocument();
    });
  });

  describe("Form Interaction", () => {
    it("should allow user to type in username field", async () => {
      const user = userEvent.setup();
      render(<RegisterForm />);

      const usernameInput = screen.getByLabelText(/felhasználónév/i);
      await user.type(usernameInput, "TestUser");

      expect(usernameInput).toHaveValue("TestUser");
    });

    it("should allow user to type in email field", async () => {
      const user = userEvent.setup();
      render(<RegisterForm />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, "test@example.com");

      expect(emailInput).toHaveValue("test@example.com");
    });

    it("should allow user to type in password field", async () => {
      const user = userEvent.setup();
      render(<RegisterForm />);

      const passwordInput = screen.getByLabelText(/jelszó/i);
      await user.type(passwordInput, "Password123");

      expect(passwordInput).toHaveValue("Password123");
    });

    it("should disable inputs and button during submission", async () => {
      const user = userEvent.setup();
      mockRegisterAction.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

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

      // Check if fields are disabled during submission
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
    });
  });

  describe("Form Submission - Success Cases", () => {
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

      expect(mockToastSuccess).toHaveBeenCalledWith(REGISTER_INFO.success);
      expect(mockPush).toHaveBeenCalledWith("/auth/login");
    });

    it("should reset form after successful submission", async () => {
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
        expect(mockToastSuccess).toHaveBeenCalled();
      });

      // Check if form fields are cleared
      expect(usernameInput).toHaveValue("");
      expect(emailInput).toHaveValue("");
      expect(passwordInput).toHaveValue("");
    });
  });

  describe("Form Submission - Error Cases", () => {
    it("should show error toast when registration fails", async () => {
      const user = userEvent.setup();
      mockRegisterAction.mockResolvedValue({
        success: false,
        message: REGISTER_INFO.serverError,
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
        expect(mockToastError).toHaveBeenCalledWith(REGISTER_INFO.serverError);
      });

      expect(mockPush).not.toHaveBeenCalled();
    });

    it("should show error toast for duplicate user", async () => {
      const user = userEvent.setup();
      mockRegisterAction.mockResolvedValue({
        success: false,
        message: REGISTER_INFO.duplicateError,
      });

      render(<RegisterForm />);

      const usernameInput = screen.getByLabelText(/felhasználónév/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/jelszó/i);
      const submitButton = screen.getByRole("button", {
        name: /regisztráció/i,
      });

      await user.type(usernameInput, "ExistingUser");
      await user.type(emailInput, "existing@example.com");
      await user.type(passwordInput, "Password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockToastError).toHaveBeenCalledWith(
          REGISTER_INFO.duplicateError,
        );
      });

      expect(mockPush).not.toHaveBeenCalled();
    });

    it("should handle unexpected errors with generic error message", async () => {
      const user = userEvent.setup();
      mockRegisterAction.mockRejectedValue(new Error("Unexpected error"));

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
        expect(mockToastError).toHaveBeenCalledWith(REGISTER_INFO.error);
      });
    });

    it("should show default error message when response has no message", async () => {
      const user = userEvent.setup();
      mockRegisterAction.mockResolvedValue({
        success: false,
        message: undefined,
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
        expect(mockToastError).toHaveBeenCalledWith(REGISTER_INFO.error);
      });
    });

    it("should show default success message when response has no message", async () => {
      const user = userEvent.setup();
      mockRegisterAction.mockResolvedValue({
        success: true,
        message: undefined,
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
        expect(mockToastSuccess).toHaveBeenCalledWith(REGISTER_INFO.success);
      });
    });
  });

  describe("Client-side Validation", () => {
    it("should show validation error for empty username", async () => {
      const user = userEvent.setup();
      render(<RegisterForm />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/jelszó/i);
      const submitButton = screen.getByRole("button", {
        name: /regisztráció/i,
      });

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "Password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/a név kötelező/i)).toBeInTheDocument();
      });

      expect(mockRegisterAction).not.toHaveBeenCalled();
    });

    it("should show validation error for invalid email format", async () => {
      const user = userEvent.setup();
      render(<RegisterForm />);

      const usernameInput = screen.getByLabelText(/felhasználónév/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/jelszó/i);
      const submitButton = screen.getByRole("button", {
        name: /regisztráció/i,
      });

      await user.type(usernameInput, "TestUser");
      await user.type(emailInput, "invalid-email");
      await user.type(passwordInput, "Password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Érvénytelen email cím!/i)).toBeInTheDocument();
      });

      expect(mockRegisterAction).not.toHaveBeenCalled();
    });

    it("should show validation error for password too short", async () => {
      const user = userEvent.setup();
      render(<RegisterForm />);

      const usernameInput = screen.getByLabelText(/felhasználónév/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/jelszó/i);
      const submitButton = screen.getByRole("button", {
        name: /regisztráció/i,
      });

      await user.type(usernameInput, "TestUser");
      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "Pass1");
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(
            /a jelszónak legalább 6 karakter hosszúnak kell lennie/i,
          ),
        ).toBeInTheDocument();
      });

      expect(mockRegisterAction).not.toHaveBeenCalled();
    });

    it("should show validation error for password without uppercase letter", async () => {
      const user = userEvent.setup();
      render(<RegisterForm />);

      const usernameInput = screen.getByLabelText(/felhasználónév/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/jelszó/i);
      const submitButton = screen.getByRole("button", {
        name: /regisztráció/i,
      });

      await user.type(usernameInput, "TestUser");
      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/a jelszónak tartalmaznia kell nagybetűt/i),
        ).toBeInTheDocument();
      });

      expect(mockRegisterAction).not.toHaveBeenCalled();
    });

    it("should show validation error for password without lowercase letter", async () => {
      const user = userEvent.setup();
      render(<RegisterForm />);

      const usernameInput = screen.getByLabelText(/felhasználónév/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/jelszó/i);
      const submitButton = screen.getByRole("button", {
        name: /regisztráció/i,
      });

      await user.type(usernameInput, "TestUser");
      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "PASSWORD123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/a jelszónak tartalmaznia kell kisbetűt/i),
        ).toBeInTheDocument();
      });

      expect(mockRegisterAction).not.toHaveBeenCalled();
    });

    it("should show validation error for password without number", async () => {
      const user = userEvent.setup();
      render(<RegisterForm />);

      const usernameInput = screen.getByLabelText(/felhasználónév/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/jelszó/i);
      const submitButton = screen.getByRole("button", {
        name: /regisztráció/i,
      });

      await user.type(usernameInput, "TestUser");
      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "Password");
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/a jelszónak tartalmaznia kell számot/i),
        ).toBeInTheDocument();
      });

      expect(mockRegisterAction).not.toHaveBeenCalled();
    });

    it("should show validation error for username too long", async () => {
      const user = userEvent.setup();
      render(<RegisterForm />);

      const usernameInput = screen.getByLabelText(/felhasználónév/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/jelszó/i);
      const submitButton = screen.getByRole("button", {
        name: /regisztráció/i,
      });

      await user.type(usernameInput, "A".repeat(31)); // 31 characters (max is 30)
      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "Password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/max hossz 30 karakter/i)).toBeInTheDocument();
      });

      expect(mockRegisterAction).not.toHaveBeenCalled();
    });

    it("should show validation error for password too long", async () => {
      const user = userEvent.setup();
      render(<RegisterForm />);

      const usernameInput = screen.getByLabelText(/felhasználónév/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/jelszó/i);
      const submitButton = screen.getByRole("button", {
        name: /regisztráció/i,
      });

      await user.type(usernameInput, "TestUser");
      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "Password1234567890123"); // 21 characters (max is 20)
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/a jelszó nem lehet hosszabb 20 karakternél/i),
        ).toBeInTheDocument();
      });

      expect(mockRegisterAction).not.toHaveBeenCalled();
    });
  });
});
