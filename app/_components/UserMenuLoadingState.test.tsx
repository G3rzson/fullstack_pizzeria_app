import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { UserMenuLoadingState } from "./UserMenuLoadingState";

describe("UserMenuLoadingState component", () => {
  it("renders loading container", () => {
    render(<UserMenuLoadingState />);

    expect(screen.getByLabelText(/felhasználó betöltése/i)).toBeInTheDocument();
  });
});
