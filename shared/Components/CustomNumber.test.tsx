import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import CustomNumber from "./CustomNumber";

type TestFormValues = {
  price?: number;
};

function Wrapper({ isSubmitting = false }: { isSubmitting?: boolean }) {
  const { control } = useForm<TestFormValues>({
    defaultValues: { price: undefined },
  });

  return (
    <CustomNumber
      control={control}
      name="price"
      label="Ár"
      placeholder="Adj meg árat"
      isSubmitting={isSubmitting}
    />
  );
}

describe("CustomNumber", () => {
  it("renders number input with label and placeholder", () => {
    render(<Wrapper />);

    const input = screen.getByLabelText("Ár");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("placeholder", "Adj meg árat");
    expect(input).toHaveAttribute("type", "number");
  });

  it("allows entering a numeric value", async () => {
    const user = userEvent.setup();
    render(<Wrapper />);

    const input = screen.getByLabelText("Ár");
    await user.type(input, "123");

    expect(input).toHaveValue(123);
  });

  it("disables the input when submitting", () => {
    render(<Wrapper isSubmitting />);

    expect(screen.getByLabelText("Ár")).toBeDisabled();
  });
});
