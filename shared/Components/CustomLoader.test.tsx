import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CustomLoader } from "./CustomLoader";

describe("CustomLoader", () => {
  it("renders an accessible loading indicator", () => {
    render(<CustomLoader />);

    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
  });
});
