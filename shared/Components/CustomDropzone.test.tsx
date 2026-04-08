import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PizzaImageDropzone from "./CustomDropzone";

describe("PizzaImageDropzone", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders upload instructions", () => {
    render(
      <PizzaImageDropzone
        value={null}
        onChange={vi.fn()}
        onBlur={vi.fn()}
        invalid={false}
      />,
    );

    expect(
      screen.getByText(/húzd ide a képet, vagy kattints a feltöltéshez/i),
    ).toBeInTheDocument();
  });

  it("renders an existing image preview and clears it on delete", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <PizzaImageDropzone
        value={{ name: "pizza.jpg", url: "/pizza.jpg" }}
        onChange={onChange}
        onBlur={vi.fn()}
        invalid={false}
      />,
    );

    expect(screen.getByAltText("Pizza előnézet")).toBeInTheDocument();
    expect(screen.getByText("pizza.jpg")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Törlés" }));

    expect(onChange).toHaveBeenCalledWith(null);
  });
});
