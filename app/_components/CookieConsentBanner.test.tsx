import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import CookieConsentBanner from "./CookieConsentBanner";

// Mock the react-cookie-consent dependency
vi.mock("react-cookie-consent", () => ({
  default: ({
    children,
    buttonText,
    declineButtonText,
  }: {
    children: React.ReactNode;
    buttonText: string;
    declineButtonText: string;
  }) => (
    <div data-testid="cookie-consent">
      {children}
      <button>{buttonText}</button>
      <button>{declineButtonText}</button>
    </div>
  ),
}));

describe("CookieConsentBanner component", () => {
  it("renders consent text, privacy link and buttons", () => {
    render(<CookieConsentBanner />);

    const banner = screen.getByTestId("cookie-consent");
    expect(banner).toBeInTheDocument();

    const consentText = screen.getByText(/ez az oldal sütiket használ/i);
    expect(consentText).toBeInTheDocument();

    const privacyLink = screen.getByRole("link", {
      name: /további információ/i,
    });
    expect(privacyLink).toHaveAttribute("href", "/privacy");

    const acceptButton = screen.getByRole("button", { name: /elfogadom/i });
    expect(acceptButton).toBeInTheDocument();

    const declineButton = screen.getByRole("button", { name: /elutasítom/i });
    expect(declineButton).toBeInTheDocument();
  });
});
