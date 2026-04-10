import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import LoginForm from "./LoginForm";
import { loginAction } from "../_actions/loginAction";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";

vi.mock("../_actions/loginAction", () => ({
  loginAction: vi.fn(),
}));

const mockPush = vi.fn();
const mockSearchParamsGet = vi.fn() as Mock;
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: mockPush,
  })),

  usePathname: vi.fn(() => "/auth/login"),
  useSearchParams: vi.fn(() => ({
    get: mockSearchParamsGet,
  })),
}));

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

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockLoginAction = loginAction as Mock;
const mockToastSuccess = toast.success as Mock;
const mockToastError = toast.error as Mock;

describe("LoginForm component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParamsGet.mockReturnValue(null);
  });

  it("renders the login form", () => {
    render(<LoginForm />);

    expect(
      screen.getByRole("form", { name: /login-form/i }),
    ).toBeInTheDocument();
  });

  it("renders username input with text type", () => {
    render(<LoginForm />);

    const usernameInput = screen.getByRole("textbox", {
      name: /felhasználónév/i,
    });

    expect(usernameInput).toBeInTheDocument();
    expect(usernameInput).toHaveAttribute("type", "text");
  });

  it("renders password input with password type", () => {
    render(<LoginForm />);

    const passwordInput = screen.getByLabelText(/jelszó/i);

    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("renders register link", () => {
    render(<LoginForm />);

    const registerLink = screen.getByRole("link", { name: /regisztrálj/i });

    expect(registerLink).toBeInTheDocument();
    expect(registerLink).toHaveAttribute("href", "/auth/register");
  });

  it("renders login submit button", () => {
    render(<LoginForm />);

    const submitButton = screen.getByRole("button", { name: /bejelentkezés/i });

    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute("type", "submit");
  });

  it("disables inputs and submit button during submission", async () => {
    const user = userEvent.setup();
    mockLoginAction.mockImplementation(() => new Promise(() => {}));

    render(<LoginForm />);

    const usernameInput = screen.getByLabelText(/felhasználónév/i);
    const passwordInput = screen.getByLabelText(/jelszó/i);
    const submitButton = screen.getByRole("button", { name: /bejelentkezés/i });

    await user.type(usernameInput, "testuser");
    await user.type(passwordInput, "Password1");
    await user.click(submitButton);

    await waitFor(() => {
      expect(usernameInput).toBeDisabled();
      expect(passwordInput).toBeDisabled();
      expect(submitButton).toBeDisabled();
    });
  });

  it("submits successfully, refreshes auth state and redirects to default path", async () => {
    const user = userEvent.setup();
    mockLoginAction.mockResolvedValue({
      success: true,
      message: BACKEND_RESPONSE_MESSAGES.SUCCESS,
    });

    render(<LoginForm />);

    const usernameInput = screen.getByLabelText(/felhasználónév/i);
    const passwordInput = screen.getByLabelText(/jelszó/i);
    const submitButton = screen.getByRole("button", { name: /bejelentkezés/i });

    await user.type(usernameInput, "TestUser");
    await user.type(passwordInput, "Password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockLoginAction).toHaveBeenCalledWith({
        username: "TestUser",
        password: "Password123",
      });
    });

    expect(mockRefreshUser).toHaveBeenCalled();
    expect(mockToastSuccess).toHaveBeenCalledWith(
      BACKEND_RESPONSE_MESSAGES.SUCCESS,
    );
    expect(mockPush).toHaveBeenCalledWith("/");
    expect(usernameInput).toHaveValue("TestUser");
    expect(passwordInput).toHaveValue("Password123");
  });

  it("redirects to callbackUrl from search params on successful login", async () => {
    const user = userEvent.setup();
    mockSearchParamsGet.mockImplementation((key: string) =>
      key === "callbackUrl" ? "/dashboard" : null,
    );
    mockLoginAction.mockResolvedValue({
      success: true,
      message: BACKEND_RESPONSE_MESSAGES.SUCCESS,
    });

    render(<LoginForm />);

    await user.type(screen.getByLabelText(/felhasználónév/i), "TestUser");
    await user.type(screen.getByLabelText(/jelszó/i), "Password123");
    await user.click(screen.getByRole("button", { name: /bejelentkezés/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("falls back to default path when callbackUrl is external", async () => {
    const user = userEvent.setup();
    mockSearchParamsGet.mockImplementation((key: string) =>
      key === "callbackUrl" ? "https://evil.example" : null,
    );
    mockLoginAction.mockResolvedValue({
      success: true,
      message: BACKEND_RESPONSE_MESSAGES.SUCCESS,
    });

    render(<LoginForm />);

    await user.type(screen.getByLabelText(/felhasználónév/i), "TestUser");
    await user.type(screen.getByLabelText(/jelszó/i), "Password123");
    await user.click(screen.getByRole("button", { name: /bejelentkezés/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  it("shows validation error response from action", async () => {
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

    expect(mockToastError).toHaveBeenCalledWith(
      BACKEND_RESPONSE_MESSAGES.INVALID_DATA,
    );
    expect(mockPush).not.toHaveBeenCalled();
    expect(usernameInput).not.toHaveValue("");
    expect(passwordInput).not.toHaveValue("");
  });

  it("shows not found error response from action", async () => {
    const user = userEvent.setup();
    mockLoginAction.mockResolvedValue({
      success: false,
      message: BACKEND_RESPONSE_MESSAGES.NOT_FOUND,
    });

    render(<LoginForm />);

    const usernameInput = screen.getByLabelText(/felhasználónév/i);
    const passwordInput = screen.getByLabelText(/jelszó/i);
    const submitButton = screen.getByRole("button", {
      name: /bejelentkezés/i,
    });

    await user.type(usernameInput, "NotExistUser");
    await user.type(passwordInput, "NotExistPassword1");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockLoginAction).toHaveBeenCalledWith({
        username: "NotExistUser",
        password: "NotExistPassword1",
      });
    });

    expect(mockToastError).toHaveBeenCalledWith(
      BACKEND_RESPONSE_MESSAGES.NOT_FOUND,
    );
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("shows server error response from action", async () => {
    const user = userEvent.setup();
    mockLoginAction.mockResolvedValue({
      success: false,
      message: BACKEND_RESPONSE_MESSAGES.SERVER_ERROR,
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

    expect(mockToastError).toHaveBeenCalledWith(
      BACKEND_RESPONSE_MESSAGES.SERVER_ERROR,
    );
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("shows generic server error when loginAction throws", async () => {
    const user = userEvent.setup();
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockLoginAction.mockRejectedValue(new Error("network failed"));

    render(<LoginForm />);

    const usernameInput = screen.getByLabelText(/felhasználónév/i);
    const passwordInput = screen.getByLabelText(/jelszó/i);
    const submitButton = screen.getByRole("button", {
      name: /bejelentkezés/i,
    });

    await user.type(usernameInput, "UnexpectedUser");
    await user.type(passwordInput, "UnexpectedPwd123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockLoginAction).toHaveBeenCalledWith({
        username: "UnexpectedUser",
        password: "UnexpectedPwd123",
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
