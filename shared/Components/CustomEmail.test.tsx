import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import CustomEmail from "./CustomEmail";

type TestFormValues = { email: string };

function Wrapper({ isSubmitting = false }: { isSubmitting?: boolean }) {
  const { control } = useForm<TestFormValues>({
    defaultValues: { email: "" },
  });

  return (
    <CustomEmail
      control={control}
      name="email"
      label="Email"
      placeholder="Írd be az email címed!"
      isSubmitting={isSubmitting}
    />
  );
}

describe("CustomEmail", () => {
  it("renders input with correct label and placeholder", () => {
    render(<Wrapper />);
    const input = screen.getByLabelText(/email/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("placeholder", "Írd be az email címed!");
  });

  it("allows typing when not submitting", async () => {
    const user = userEvent.setup();
    render(<Wrapper />);
    const input = screen.getByLabelText(/email/i);

    await user.type(input, "test@example.com");
    expect(input).toHaveValue("test@example.com");
  });

  it("disables input when isSubmitting is true", () => {
    render(<Wrapper isSubmitting />);
    const input = screen.getByLabelText(/email/i);
    expect(input).toBeDisabled();
  });
});
