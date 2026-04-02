import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CustomText from "./CustomText";

// Teszt séma validációval
const testSchema = z.object({
  username: z.string().min(1, "Ez a mező kötelező!"),
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
    defaultValues: { username: "" },
  });

  return (
    <form onSubmit={handleSubmit(() => {})} noValidate>
      <CustomText
        control={control}
        name="username"
        label="Felhasználónév"
        placeholder="Írd be a neved!"
        isSubmitting={isSubmitting}
      />
      <button type="submit">Submit</button>
    </form>
  );
}

describe("CustomText", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders input with correct label and placeholder", () => {
    render(<ValidationWrapper />);
    const input = screen.getByLabelText(/felhasználónév/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("placeholder", "Írd be a neved!");
  });

  it("allows typing when not submitting", async () => {
    const user = userEvent.setup();
    render(<ValidationWrapper />);
    const input = screen.getByLabelText(/felhasználónév/i);

    await user.type(input, "TestUser");
    expect(input).toHaveValue("TestUser");
  });

  it("disables input when isSubmitting is true", () => {
    render(<ValidationWrapper isSubmitting />);
    const input = screen.getByLabelText(/felhasználónév/i);
    expect(input).toBeDisabled();
  });

  it("shows validation error on empty submit", async () => {
    const user = userEvent.setup();
    render(<ValidationWrapper />);
    const submitButton = screen.getByRole("button", { name: /submit/i });

    await user.click(submitButton);

    const errorMessage = await screen.findByText(/ez a mező kötelező/i);
    expect(errorMessage).toBeInTheDocument();
  });
});
