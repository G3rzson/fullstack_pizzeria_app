import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import ImageForm from "./ImageForm";

vi.mock("@/shared/Components/CustomImage", () => ({
  default: ({ label }: { label: string }) => <div>{label}</div>,
}));

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: mockPush,
  })),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockToastSuccess = toast.success as Mock;
const mockToastError = toast.error as Mock;

describe("ImageForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("submits the upload flow when there is no existing image", async () => {
    const user = userEvent.setup();
    const uploadImageAction = vi.fn().mockResolvedValue({
      success: true,
      message: "Sikeres feltöltés",
      data: {},
    });
    const updateImageAction = vi.fn();

    render(
      <ImageForm
        returnUrl="/dashboard/pizzas"
        menuObject={{
          id: "pizza-1",
          pizzaName: "Margherita",
          pizzaPrice32: 1000,
          pizzaPrice45: 1500,
          pizzaDescription: "Klasszikus",
          isAvailableOnMenu: true,
          image: null,
        }}
        updateImageAction={updateImageAction}
        uploadImageAction={uploadImageAction}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Kép feltöltése" }));

    await waitFor(() => {
      expect(uploadImageAction).toHaveBeenCalledWith("pizza-1", null);
    });

    expect(updateImageAction).not.toHaveBeenCalled();
    expect(mockToastSuccess).toHaveBeenCalledWith("Sikeres feltöltés");
    expect(mockToastError).not.toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith("/dashboard/pizzas");
  });

  it("submits the update flow when an image already exists", async () => {
    const user = userEvent.setup();
    const uploadImageAction = vi.fn();
    const updateImageAction = vi.fn().mockResolvedValue({
      success: true,
      message: "Sikeres frissítés",
      data: {},
    });

    render(
      <ImageForm
        returnUrl="/dashboard/pizzas"
        menuObject={{
          id: "pizza-1",
          pizzaName: "Margherita",
          pizzaPrice32: 1000,
          pizzaPrice45: 1500,
          pizzaDescription: "Klasszikus",
          isAvailableOnMenu: true,
          image: {
            id: "image-1",
            pizzaId: "pizza-1",
            publicId: "public-1",
            originalName: "pizza.jpg",
            publicUrl: "/pizza.jpg",
          },
        }}
        updateImageAction={updateImageAction}
        uploadImageAction={uploadImageAction}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Kép frissítése" }));

    await waitFor(() => {
      expect(updateImageAction).toHaveBeenCalledWith(
        "pizza-1",
        null,
        "public-1",
      );
    });

    expect(uploadImageAction).not.toHaveBeenCalled();
    expect(mockToastSuccess).toHaveBeenCalledWith("Sikeres frissítés");
    expect(mockPush).toHaveBeenCalledWith("/dashboard/pizzas");
  });
});
