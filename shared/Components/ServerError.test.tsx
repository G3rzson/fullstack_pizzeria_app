import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ServerError from "./ServerError";
import { BACKEND_RESPONSE_MESSAGES } from "../Constants/constants";

describe("ServerError component", () => {
  it("renders the provided error message", () => {
    render(
      <ServerError errorMsg="Custom error" path="/home" title="Go Back" />,
    );
    expect(screen.getByText("Custom error")).toBeInTheDocument();
  });

  it("renders default server error message if errorMsg is empty", () => {
    render(<ServerError errorMsg="" path="/home" title="Go Back" />);
    expect(
      screen.getByText(BACKEND_RESPONSE_MESSAGES.SERVER_ERROR),
    ).toBeInTheDocument();
  });

  it("renders the link with correct path and title", () => {
    render(
      <ServerError
        errorMsg="Error"
        path="/dashboard"
        title="Back to dashboard"
      />,
    );
    const link = screen.getByRole("link", { name: /Back to dashboard/i });
    expect(link).toHaveAttribute("href", "/dashboard");
  });
});
