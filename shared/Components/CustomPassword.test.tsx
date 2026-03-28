import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CustomPassword from "./CustomPassword";

// Teszt séma validációval
const testSchema = z.object({
  password: z
    .string()
    .min(6, "A jelszónak legalább 6 karakter hosszúnak kell lennie!")
    .max(20, "A jelszó nem lehet hosszabb 20 karakternél!")
    .refine((val) => /[a-z]/.test(val), {
      message: "A jelszónak tartalmaznia kell kisbetűt",
    })
    .refine((val) => /[A-Z]/.test(val), {
      message: "A jelszónak tartalmaznia kell nagybetűt",
    })
    .refine((val) => /\d/.test(val), {
      message: "A jelszónak tartalmaznia kell számot",
    })
    .refine((val) => /^[A-Za-z\d]+$/.test(val), {
      message: "A jelszó nem tartalmazhat speciális karaktert",
    }),
});

type TestFormValues = z.infer<typeof testSchema>;

// Mock next/navigation
vi.mock("next/navigation", () => ({
  // registerForm password field uses it to determine the current path
  usePathname: vi.fn(() => "/auth/register"),
}));

// Egyetlen Wrapper a teszthez, kezeli a validációt és submitet
function ValidationWrapper({
  isSubmitting = false,
}: {
  isSubmitting?: boolean;
}) {
  const { control, handleSubmit } = useForm<TestFormValues>({
    resolver: zodResolver(testSchema),
    defaultValues: { password: "" },
  });

  return (
    <form onSubmit={handleSubmit(() => {})} noValidate>
      <CustomPassword
        control={control}
        name="password"
        label="Jelszó"
        placeholder="Írd be a jelszavad!"
        isSubmitting={isSubmitting}
      />
      <button type="submit">Submit</button>
    </form>
  );
}

describe("CustomPassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders input with correct label and placeholder", () => {
    render(<ValidationWrapper />);
    const input = screen.getByLabelText(/jelszó/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("placeholder", "Írd be a jelszavad!");
  });

  it("allows typing when not submitting", async () => {
    const user = userEvent.setup();
    render(<ValidationWrapper />);
    const input = screen.getByLabelText(/jelszó/i);

    await user.type(input, "TestPassword123");
    expect(input).toHaveValue("TestPassword123");
  });

  it("should allow user to click password offer button", async () => {
    const user = userEvent.setup();
    render(<ValidationWrapper />);

    const passwordOfferButton = screen.getByRole("button", {
      name: /jelszó ajánlása/i,
    });
    await user.click(passwordOfferButton);

    // After clicking the password offer button, the password field should be filled with a generated password
    const passwordInput = screen.getByLabelText(/jelszó/i);
    expect(passwordInput).not.toHaveValue("");
  });

  it("disables input when isSubmitting is true", () => {
    render(<ValidationWrapper isSubmitting />);
    const input = screen.getByLabelText(/jelszó/i);
    expect(input).toBeDisabled();
  });

  it("shows validation error on empty submit", async () => {
    const user = userEvent.setup();
    render(<ValidationWrapper />);
    const submitButton = screen.getByRole("button", { name: /submit/i });

    await user.click(submitButton);

    const errorMessage = await screen.findByText(
      /a jelszónak legalább 6 karakter hosszúnak kell lennie/i,
    );
    expect(errorMessage).toBeInTheDocument();
  });
});
