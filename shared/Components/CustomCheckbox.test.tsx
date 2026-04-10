import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import CustomCheckbox from "./CustomCheckbox";

type TestFormValues = {
  accepted: boolean;
};

function Wrapper({ isSubmitting = false }: { isSubmitting?: boolean }) {
  const { control } = useForm<TestFormValues>({
    defaultValues: { accepted: false },
  });

  return (
    <CustomCheckbox
      control={control}
      name="accepted"
      label="Elfogadom"
      isSubmitting={isSubmitting}
    />
  );
}

describe("CustomCheckbox", () => {
  it("renders the checkbox with its label", () => {
    render(<Wrapper />);

    expect(screen.getByRole("checkbox")).toBeInTheDocument();
    expect(screen.getByText("Elfogadom")).toBeInTheDocument();
  });

  it("toggles the checkbox when clicked", async () => {
    const user = userEvent.setup();
    render(<Wrapper />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("aria-checked", "false");

    await user.click(checkbox);

    expect(checkbox).toHaveAttribute("aria-checked", "true");
  });

  it("disables the checkbox when submitting", () => {
    render(<Wrapper isSubmitting />);

    expect(screen.getByRole("checkbox")).toBeDisabled();
  });
});
