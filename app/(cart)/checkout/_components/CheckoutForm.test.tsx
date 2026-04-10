import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CheckoutForm from "./CheckoutForm";
import { type AddressDtoType } from "@/shared/Types/types";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";

const mockPush = vi.fn();
const mockSetCartItems = vi.fn();
const mockReset = vi.fn();

let submitData = {
  fullName: "Teszt Elek",
  phoneNumber: "+36301234567",
  postalCode: "1111",
  city: "Budapest",
  street: "Fo utca",
  houseNumber: "12",
  floor: "2/5",
  saveAddress: false,
};

vi.mock("react-hook-form", () => ({
  useForm: vi.fn(() => ({
    handleSubmit:
      (onSubmit: (data: typeof submitData) => Promise<void>) =>
      async (event?: { preventDefault?: () => void }) => {
        event?.preventDefault?.();
        await onSubmit(submitData);
      },
    control: {},
    reset: mockReset,
    formState: { isSubmitting: false },
  })),
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({ push: mockPush })),
}));

vi.mock("@/lib/cart/useCart", () => ({
  useCart: vi.fn(() => ({
    cartItems: [],
    setCartItems: mockSetCartItems,
    isLoading: false,
    setIsLoading: vi.fn(),
  })),
}));

vi.mock("../_actions/saveAddressAction", () => ({
  saveAddressAction: vi.fn(),
}));

vi.mock("../_actions/updateAddressAction", () => ({
  updateAddressAction: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/components/ui/card", () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardTitle: ({ children }: { children: React.ReactNode }) => (
    <h2>{children}</h2>
  ),
  CardDescription: ({ children }: { children: React.ReactNode }) => (
    <p>{children}</p>
  ),
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardFooter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: React.ComponentProps<"button">) => (
    <button {...props}>{children}</button>
  ),
}));

vi.mock("@/components/ui/field", () => ({
  FieldGroup: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock("@/shared/Components/CustomText", () => ({
  default: () => <div data-testid="custom-text" />,
}));

vi.mock("@/shared/Components/CustomCheckbox", () => ({
  default: () => <div data-testid="custom-checkbox" />,
}));

vi.mock("@/shared/Components/CustomLoader", () => ({
  CustomLoader: () => <div data-testid="custom-loader">loading</div>,
}));

import { saveAddressAction } from "../_actions/saveAddressAction";
import { updateAddressAction } from "../_actions/updateAddressAction";
import { toast } from "sonner";

const mockSaveAddressAction = saveAddressAction as unknown as Mock;
const mockUpdateAddressAction = updateAddressAction as unknown as Mock;
const mockToastSuccess = toast.success as unknown as Mock;
const mockToastError = toast.error as unknown as Mock;

describe("CheckoutForm component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    submitData = {
      fullName: "Teszt Elek",
      phoneNumber: "+36301234567",
      postalCode: "1111",
      city: "Budapest",
      street: "Fo utca",
      houseNumber: "12",
      floor: "2/5",
      saveAddress: false,
    };
  });

  it("prefills form via reset when address is provided", () => {
    const address: AddressDtoType = {
      id: "addr-1",
      fullName: "Teszt Elek",
      phoneNumber: "+36301234567",
      postalCode: "1111",
      city: "Budapest",
      street: "Fo utca",
      houseNumber: "12",
      floorAndDoor: "2/5",
      isSaved: true,
    };

    render(<CheckoutForm address={address} userId="user-1" />);

    expect(mockReset).toHaveBeenCalledWith({
      fullName: "Teszt Elek",
      phoneNumber: "+36301234567",
      postalCode: "1111",
      city: "Budapest",
      street: "Fo utca",
      houseNumber: "12",
      floor: "2/5",
      saveAddress: false,
    });
  });

  it("creates new address when saveAddress is true and no existing address", async () => {
    const user = userEvent.setup();
    submitData = { ...submitData, saveAddress: true };
    mockSaveAddressAction.mockResolvedValue({
      success: true,
      message: "Mentve!",
    });

    render(<CheckoutForm address={null} userId="user-1" />);

    await user.click(screen.getByRole("button", { name: "Rendelés leadása" }));

    await waitFor(() => {
      expect(mockSaveAddressAction).toHaveBeenCalledWith("user-1", submitData);
    });
    expect(mockUpdateAddressAction).not.toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith("/payment");
    expect(mockSetCartItems).toHaveBeenCalledWith([]);
    expect(mockToastSuccess).toHaveBeenCalledWith("Mentve!");
    expect(mockToastSuccess).toHaveBeenCalledWith(
      BACKEND_RESPONSE_MESSAGES.SUCCESS,
    );
  });

  it("updates existing address when saveAddress is true and address exists", async () => {
    const user = userEvent.setup();
    submitData = { ...submitData, saveAddress: true };
    const address: AddressDtoType = {
      id: "addr-1",
      fullName: "Teszt Elek",
      phoneNumber: "+36301234567",
      postalCode: "1111",
      city: "Budapest",
      street: "Fo utca",
      houseNumber: "12",
      floorAndDoor: null,
      isSaved: true,
    };
    mockUpdateAddressAction.mockResolvedValue({
      success: true,
      message: "Frissitve!",
    });

    render(<CheckoutForm address={address} userId="user-1" />);

    await user.click(screen.getByRole("button", { name: "Rendelés leadása" }));

    await waitFor(() => {
      expect(mockUpdateAddressAction).toHaveBeenCalledWith(
        "user-1",
        submitData,
      );
    });
    expect(mockSaveAddressAction).not.toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith("/payment");
    expect(mockSetCartItems).toHaveBeenCalledWith([]);
    expect(mockToastSuccess).toHaveBeenCalledWith("Frissitve!");
    expect(mockToastSuccess).toHaveBeenCalledWith(
      BACKEND_RESPONSE_MESSAGES.SUCCESS,
    );
  });

  it("shows save error toast but still completes order flow", async () => {
    const user = userEvent.setup();
    submitData = { ...submitData, saveAddress: true };
    mockSaveAddressAction.mockRejectedValue(new Error("save failed"));

    render(<CheckoutForm address={null} userId="user-1" />);

    await user.click(screen.getByRole("button", { name: "Rendelés leadása" }));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        BACKEND_RESPONSE_MESSAGES.SERVER_ERROR,
      );
    });
    expect(mockPush).toHaveBeenCalledWith("/payment");
    expect(mockToastSuccess).toHaveBeenCalledWith(
      BACKEND_RESPONSE_MESSAGES.SUCCESS,
    );
    expect(mockSetCartItems).toHaveBeenCalledWith([]);
  });

  it("does not render save-address checkbox for guest user", () => {
    render(<CheckoutForm address={null} userId={null} />);

    expect(screen.queryByTestId("custom-checkbox")).not.toBeInTheDocument();
  });

  it("does not call save or update actions when userId is null", async () => {
    const user = userEvent.setup();
    submitData = { ...submitData, saveAddress: true };

    render(<CheckoutForm address={null} userId={null} />);

    await user.click(screen.getByRole("button", { name: "Rendelés leadása" }));

    await waitFor(() => {
      expect(mockSaveAddressAction).not.toHaveBeenCalled();
      expect(mockUpdateAddressAction).not.toHaveBeenCalled();
    });
    expect(mockPush).toHaveBeenCalledWith("/payment");
    expect(mockToastSuccess).toHaveBeenCalledWith(
      BACKEND_RESPONSE_MESSAGES.SUCCESS,
    );
    expect(mockSetCartItems).toHaveBeenCalledWith([]);
  });
});
