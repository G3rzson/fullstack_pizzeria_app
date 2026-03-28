import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CustomEmail from "./CustomEmail";

// Teszt séma validációval
const testSchema = z.object({
  email: z.string().email("Érvényes email címet adj meg!"),
});

type TestFormValues = z.infer<typeof testSchema>;

// Egyetlen Wrapper a teszthez, kezeli a validációt és submitet
function ValidationWrapper({
  isSubmitting = false,
}: {
  isSubmitting?: boolean;
}) {
  const { control, handleSubmit } = useForm<TestFormValues>({
    resolver: zodResolver(testSchema),
    defaultValues: { email: "" },
  });

  return (
    <form onSubmit={handleSubmit(() => {})} noValidate>
      <CustomEmail
        control={control}
        name="email"
        label="Email"
        placeholder="Írd be az email címed!"
        isSubmitting={isSubmitting}
      />
      <button type="submit">Submit</button>
    </form>
  );
}

describe("CustomEmail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders input with correct label and placeholder", () => {
    render(<ValidationWrapper />);
    const input = screen.getByLabelText(/email/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("placeholder", "Írd be az email címed!");
  });

  it("allows typing when not submitting", async () => {
    const user = userEvent.setup();
    render(<ValidationWrapper />);
    const input = screen.getByLabelText(/email/i);

    await user.type(input, "test@example.com");
    expect(input).toHaveValue("test@example.com");
  });

  it("disables input when isSubmitting is true", () => {
    render(<ValidationWrapper isSubmitting />);
    const input = screen.getByLabelText(/email/i);
    expect(input).toBeDisabled();
  });

  it("shows validation error on invalid email", async () => {
    const user = userEvent.setup();
    render(<ValidationWrapper />);
    const submitButton = screen.getByRole("button", { name: /submit/i });

    await user.click(submitButton);

    const errorMessage = await screen.findByText(
      /érvényes email címet adj meg/i,
    );
    expect(errorMessage).toBeInTheDocument();
  });
});
