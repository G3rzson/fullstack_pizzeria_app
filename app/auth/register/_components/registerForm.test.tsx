import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import RegisterForm from "../_components/RegisterForm";
import { registerAction } from "../_actions/registerAction";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";

vi.mock("../_actions/registerAction", () => ({
  registerAction: vi.fn(),
}));

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: mockPush,
  })),

  usePathname: vi.fn(() => "/auth/register"),
  useSearchParams: vi.fn(() => ({
    get: vi.fn(() => null),
  })),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockRegisterAction = registerAction as Mock;
const mockToastSuccess = toast.success as Mock;
const mockToastError = toast.error as Mock;

describe("RegisterForm component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the registration form", () => {
    render(<RegisterForm />);

    expect(
      screen.getByRole("form", { name: /register-form/i }),
    ).toBeInTheDocument();
  });

  it("renders username input with correct type", () => {
    render(<RegisterForm />);

    const usernameInput = screen.getByRole("textbox", {
      name: /felhasználónév/i,
    });
    expect(usernameInput).toBeInTheDocument();
    expect(usernameInput).toHaveAttribute("type", "text");
  });

  it("renders email input with correct type", () => {
    render(<RegisterForm />);

    const emailInput = screen.getByRole("textbox", { name: /email/i });
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute("type", "email");
  });

  it("renders password input with correct type", () => {
    render(<RegisterForm />);

    const passwordInput = screen.getByLabelText(/jelszó/i);
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("renders password offer button", () => {
    render(<RegisterForm />);

    const passwordOfferButton = screen.getByRole("button", {
      name: /jelszó ajánlása/i,
    });
    expect(passwordOfferButton).toBeInTheDocument();
  });

  it("renders login link", () => {
    render(<RegisterForm />);

    const loginLink = screen.getByRole("link", { name: /jelentkezz be/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute("href", "/auth/login");
  });

  it("renders registration button", () => {
    render(<RegisterForm />);

    expect(
      screen.getByRole("button", { name: /regisztráció/i }),
    ).toBeInTheDocument();
  });

  it("disables inputs and buttons during submission", async () => {
    const user = userEvent.setup();

    mockRegisterAction.mockImplementation(() => new Promise(() => {}));
    render(<RegisterForm />);

    const usernameInput = screen.getByLabelText(/felhasználónév/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/jelszó/i);
    const passwordOfferButton = screen.getByRole("button", {
      name: /jelszó ajánlása/i,
    });
    const submitButton = screen.getByRole("button", { name: /regisztráció/i });

    await user.type(usernameInput, "TestUser");
    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "ValidPass123");

    await user.click(submitButton);

    await waitFor(() => {
      expect(usernameInput).toBeDisabled();
      expect(emailInput).toBeDisabled();
      expect(passwordInput).toBeDisabled();
      expect(passwordOfferButton).toBeDisabled();
      expect(submitButton).toBeDisabled();
    });
  });

  it("submits successfully and redirects to login", async () => {
    const user = userEvent.setup();
    mockRegisterAction.mockResolvedValue({
      success: true,
      message: BACKEND_RESPONSE_MESSAGES.SUCCESS,
    });

    render(<RegisterForm />);

    const usernameInput = screen.getByLabelText(/felhasználónév/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/jelszó/i);

    await user.type(usernameInput, "TestUser");
    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "Password123");
    await user.click(screen.getByRole("button", { name: /regisztráció/i }));

    await waitFor(() => {
      expect(mockRegisterAction).toHaveBeenCalledWith({
        username: "TestUser",
        email: "test@example.com",
        password: "Password123",
      });
    });

    expect(mockToastSuccess).toHaveBeenCalledWith(
      BACKEND_RESPONSE_MESSAGES.SUCCESS,
    );
    expect(mockPush).toHaveBeenCalledWith("/auth/login");
    expect(usernameInput).toHaveValue("");
    expect(emailInput).toHaveValue("");
    expect(passwordInput).toHaveValue("");
  });

  it("shows validation error response from action", async () => {
    const user = userEvent.setup();
    mockRegisterAction.mockResolvedValue({
      success: false,
      message: BACKEND_RESPONSE_MESSAGES.INVALID_DATA,
    });

    render(<RegisterForm />);

    const usernameInput = screen.getByLabelText(/felhasználónév/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/jelszó/i);

    await user.type(usernameInput, "InvalidUser");
    await user.type(emailInput, "invalid@example.com");
    await user.type(passwordInput, "InvalidPassword123");
    await user.click(screen.getByRole("button", { name: /regisztráció/i }));

    await waitFor(() => {
      expect(mockRegisterAction).toHaveBeenCalledWith({
        username: "InvalidUser",
        email: "invalid@example.com",
        password: "InvalidPassword123",
      });
    });

    expect(mockToastError).toHaveBeenCalledWith(
      BACKEND_RESPONSE_MESSAGES.INVALID_DATA,
    );
    expect(mockPush).not.toHaveBeenCalled();
    expect(usernameInput).not.toHaveValue("");
    expect(emailInput).not.toHaveValue("");
    expect(passwordInput).not.toHaveValue("");
  });

  it("shows duplicate error response from action", async () => {
    const user = userEvent.setup();
    mockRegisterAction.mockResolvedValue({
      success: false,
      message: BACKEND_RESPONSE_MESSAGES.DUPLICATE_ERROR,
    });

    render(<RegisterForm />);

    await user.type(screen.getByLabelText(/felhasználónév/i), "ExistingUser");
    await user.type(screen.getByLabelText(/email/i), "existing@example.com");
    await user.type(screen.getByLabelText(/jelszó/i), "Password123");
    await user.click(screen.getByRole("button", { name: /regisztráció/i }));

    await waitFor(() => {
      expect(mockRegisterAction).toHaveBeenCalledWith({
        username: "ExistingUser",
        email: "existing@example.com",
        password: "Password123",
      });
    });

    expect(mockToastError).toHaveBeenCalledWith(
      BACKEND_RESPONSE_MESSAGES.DUPLICATE_ERROR,
    );
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("shows server error response from action", async () => {
    const user = userEvent.setup();
    mockRegisterAction.mockResolvedValue({
      success: false,
      message: BACKEND_RESPONSE_MESSAGES.SERVER_ERROR,
    });

    render(<RegisterForm />);

    await user.type(screen.getByLabelText(/felhasználónév/i), "TestUser");
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/jelszó/i), "Password123");
    await user.click(screen.getByRole("button", { name: /regisztráció/i }));

    await waitFor(() => {
      expect(mockRegisterAction).toHaveBeenCalledWith({
        username: "TestUser",
        email: "test@example.com",
        password: "Password123",
      });
    });

    expect(mockToastError).toHaveBeenCalledWith(
      BACKEND_RESPONSE_MESSAGES.SERVER_ERROR,
    );
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("shows generic server error when registerAction throws", async () => {
    const user = userEvent.setup();
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockRegisterAction.mockRejectedValue(new Error("network failed"));

    render(<RegisterForm />);

    await user.type(screen.getByLabelText(/felhasználónév/i), "CrashUser");
    await user.type(screen.getByLabelText(/email/i), "crash@example.com");
    await user.type(screen.getByLabelText(/jelszó/i), "CrashPassword1");
    await user.click(screen.getByRole("button", { name: /regisztráció/i }));

    await waitFor(() => {
      expect(mockRegisterAction).toHaveBeenCalledWith({
        username: "CrashUser",
        email: "crash@example.com",
        password: "CrashPassword1",
      });
    });

    expect(mockToastError).toHaveBeenCalledWith(
      BACKEND_RESPONSE_MESSAGES.SERVER_ERROR,
    );
    expect(mockPush).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
