import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import CustomImage from "./CustomImage";

vi.mock("./CustomDropzone", () => ({
  default: ({ invalid }: { invalid: boolean }) => (
    <div data-testid="image-dropzone" data-invalid={invalid} />
  ),
}));

type TestFormValues = { image: File | null };

function Wrapper() {
  const { control, setError } = useForm<TestFormValues>({
    defaultValues: { image: null },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setError("image", { message: "Kép megadása kötelező!" });
      }}
    >
      <CustomImage control={control} name="image" label="Pizza kép" />
      <button type="submit">Submit</button>
    </form>
  );
}

describe("CustomImage", () => {
  it("renders the label and dropzone", () => {
    render(<Wrapper />);

    expect(screen.getByText("Pizza kép")).toBeInTheDocument();
    expect(screen.getByTestId("image-dropzone")).toBeInTheDocument();
  });

  it("shows validation error and marks dropzone invalid on error", async () => {
    const user = userEvent.setup();
    render(<Wrapper />);

    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(
      await screen.findByText("Kép megadása kötelező!"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("image-dropzone")).toHaveAttribute(
      "data-invalid",
      "true",
    );
  });
});
