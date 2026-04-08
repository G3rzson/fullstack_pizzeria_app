import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MenuNavLink from "./MenuNavLink";

describe("MenuNavLink component", () => {
  it("renders a link with the correct title and href", () => {
    render(<MenuNavLink href="/test" title="Click Me" />);
    const link = screen.getByRole("link", { name: "Click Me" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/test");
  });
});
