import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import CustomPassword from "./CustomPassword";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/auth/register"),
}));

type TestFormValues = { password: string };

function Wrapper({ isSubmitting = false }: { isSubmitting?: boolean }) {
  const { control } = useForm<TestFormValues>({
    defaultValues: { password: "" },
  });

  return (
    <CustomPassword
      control={control}
      name="password"
      label="Jelszó"
      placeholder="Írd be a jelszavad!"
      isSubmitting={isSubmitting}
    />
  );
}

describe("CustomPassword", () => {
  it("renders input with correct label and placeholder", () => {
    render(<Wrapper />);
    const input = screen.getByLabelText(/jelszó/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("placeholder", "Írd be a jelszavad!");
  });

  it("allows typing when not submitting", async () => {
    const user = userEvent.setup();
    render(<Wrapper />);
    const input = screen.getByLabelText(/jelszó/i);

    await user.type(input, "TestPassword123");
    expect(input).toHaveValue("TestPassword123");
  });

  it("should allow user to click password offer button", async () => {
    const user = userEvent.setup();
    render(<Wrapper />);

    const passwordOfferButton = screen.getByRole("button", {
      name: /jelszó ajánlása/i,
    });
    await user.click(passwordOfferButton);

    const passwordInput = screen.getByLabelText(/jelszó/i);
    expect(passwordInput).not.toHaveValue("");
  });

  it("disables input when isSubmitting is true", () => {
    render(<Wrapper isSubmitting />);
    const input = screen.getByLabelText(/jelszó/i);
    expect(input).toBeDisabled();
  });
});
