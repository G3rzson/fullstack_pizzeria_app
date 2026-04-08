import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import RegisterForm from "../_components/RegisterForm";
import userEvent from "@testing-library/user-event";
import { registerAction } from "../_actions/registerAction";

// Mock registerAction
vi.mock("../_actions/registerAction", () => ({
  registerAction: vi.fn(),
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

const mockRegisterAction = registerAction as Mock;

describe("Register Form Render", () => {
  beforeEach(() => {
    // Clear all mocks before each test to ensure test isolation
    vi.clearAllMocks();
  });

  it("should render the registration form", () => {
    render(<RegisterForm />);

    expect(
      screen.getByRole("form", { name: /register-form/i }),
    ).toBeInTheDocument();
  });

  it("should render username input with correct type", () => {
    render(<RegisterForm />);

    const usernameInput = screen.getByRole("textbox", {
      name: /felhasználónév/i,
    });
    expect(usernameInput).toBeInTheDocument();
    expect(usernameInput).toHaveAttribute("type", "text");
  });

  it("should render email input with correct type", () => {
    render(<RegisterForm />);

    const emailInput = screen.getByRole("textbox", { name: /email/i });
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute("type", "email");
  });

  it("should render password input with correct type", () => {
    render(<RegisterForm />);

    const passwordInput = screen.getByLabelText(/jelszó/i);
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("should render password offer button", () => {
    render(<RegisterForm />);

    const passwordOfferButton = screen.getByRole("button", {
      name: /jelszó ajánlása/i,
    });
    expect(passwordOfferButton).toBeInTheDocument();
  });

  it("should render login link", () => {
    render(<RegisterForm />);

    const loginLink = screen.getByRole("link", { name: /jelentkezz be/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute("href", "/auth/login");
  });

  it("should allow user to click login link", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const loginLink = screen.getByRole("link", { name: /jelentkezz be/i });
    await user.click(loginLink);

    expect(loginLink).toHaveAttribute("href", "/auth/login");
  });

  it("should render registration button", () => {
    render(<RegisterForm />);

    expect(
      screen.getByRole("button", { name: /regisztráció/i }),
    ).toBeInTheDocument();
  });

  it("should disable inputs and buttons during submission", async () => {
    const user = userEvent.setup();

    mockRegisterAction.mockImplementation(() => new Promise(() => {})); // soha nem resolve
    render(<RegisterForm />);

    const usernameInput = screen.getByLabelText(/felhasználónév/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/jelszó/i);
    const passwordOfferButton = screen.getByRole("button", {
      name: /jelszó ajánlása/i,
    });
    const submitButton = screen.getByRole("button", { name: /regisztráció/i });

    // Fill in the form with valid data so validation passes
    await user.type(usernameInput, "TestUser");
    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "ValidPass123");

    // Simulate form submission by clicking the submit button
    await user.click(submitButton);

    // After clicking the submit button, all inputs and buttons should be disabled
    await waitFor(() => {
      expect(usernameInput).toBeDisabled();
      expect(emailInput).toBeDisabled();
      expect(passwordInput).toBeDisabled();
      expect(passwordOfferButton).toBeDisabled();
      expect(submitButton).toBeDisabled();
    });
  });
});
