import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import CookieConsentBanner from "./CookieConsentBanner";

vi.mock("react-cookie-consent", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="cookie-consent">{children}</div>
  ),
}));

describe("CookieConsentBanner", () => {
  it("renders consent text and privacy link", () => {
    render(<CookieConsentBanner />);

    expect(screen.getByTestId("cookie-consent")).toBeInTheDocument();
    expect(
      screen.getByText(/ez az oldal sütiket használ/i),
    ).toBeInTheDocument();

    const privacyLink = screen.getByRole("link", {
      name: /további információ/i,
    });
    expect(privacyLink).toHaveAttribute("href", "/privacy");
  });
});
