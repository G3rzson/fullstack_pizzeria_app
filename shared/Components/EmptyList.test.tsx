import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import EmptyList from "./EmptyList";

describe("EmptyList", () => {
  it("renders the provided empty state text", () => {
    render(<EmptyList text="Nincs találat" />);

    expect(screen.getByText("Nincs találat")).toBeInTheDocument();
  });
});
