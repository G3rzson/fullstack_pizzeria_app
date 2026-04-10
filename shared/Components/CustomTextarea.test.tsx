import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import CustomTextarea from "./CustomTextarea";

type TestFormValues = {
  description?: string;
};

function Wrapper({ isSubmitting = false }: { isSubmitting?: boolean }) {
  const { control } = useForm<TestFormValues>({
    defaultValues: { description: "" },
  });

  return (
    <CustomTextarea
      control={control}
      name="description"
      label="Leírás"
      placeholder="Adj meg leírást"
      isSubmitting={isSubmitting}
    />
  );
}

describe("CustomTextarea", () => {
  it("renders textarea with label and placeholder", () => {
    render(<Wrapper />);

    const textarea = screen.getByLabelText("Leírás");
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute("placeholder", "Adj meg leírást");
  });

  it("allows typing when enabled", async () => {
    const user = userEvent.setup();
    render(<Wrapper />);

    const textarea = screen.getByLabelText("Leírás");
    await user.type(textarea, "Finom teszta szoveg");

    expect(textarea).toHaveValue("Finom teszta szoveg");
  });

  it("disables the textarea when submitting", () => {
    render(<Wrapper isSubmitting />);

    expect(screen.getByLabelText("Leírás")).toBeDisabled();
  });
});
