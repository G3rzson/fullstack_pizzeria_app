import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import CustomText from "./CustomText";

type TestFormValues = { username: string };

function Wrapper({ isSubmitting = false }: { isSubmitting?: boolean }) {
  const { control } = useForm<TestFormValues>({
    defaultValues: { username: "" },
  });

  return (
    <CustomText
      control={control}
      name="username"
      label="Felhasználónév"
      placeholder="Írd be a neved!"
      isSubmitting={isSubmitting}
    />
  );
}

describe("CustomText", () => {
  it("renders input with correct label and placeholder", () => {
    render(<Wrapper />);
    const input = screen.getByLabelText(/felhasználónév/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("placeholder", "Írd be a neved!");
  });

  it("allows typing when not submitting", async () => {
    const user = userEvent.setup();
    render(<Wrapper />);
    const input = screen.getByLabelText(/felhasználónév/i);

    await user.type(input, "TestUser");
    expect(input).toHaveValue("TestUser");
  });

  it("disables input when isSubmitting is true", () => {
    render(<Wrapper isSubmitting />);
    const input = screen.getByLabelText(/felhasználónév/i);
    expect(input).toBeDisabled();
  });
});
