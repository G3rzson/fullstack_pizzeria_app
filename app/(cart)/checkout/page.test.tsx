import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import CheckoutPage from "./page";
import { type AddressDtoType } from "@/shared/Types/types";

const componentMocks = vi.hoisted(() => ({
  CheckoutForm: vi.fn(
    ({
      userId,
      address,
    }: {
      userId: string | null;
      address: AddressDtoType | null;
    }) => (
      <div data-testid="checkout-form">
        user:{userId ?? "null"} address:{address ? address.id : "null"}
      </div>
    ),
  ),
}));

vi.mock("./_components/CheckoutForm", () => ({
  default: componentMocks.CheckoutForm,
}));

vi.mock("./_actions/getAddressByIdAction", () => ({
  getAddressByIdAction: vi.fn(),
}));

import { getAddressByIdAction } from "./_actions/getAddressByIdAction";

const mockGetAddressByIdAction = getAddressByIdAction as unknown as Mock;

describe("CheckoutPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders guest checkout without address lookup", async () => {
    const ui = await CheckoutPage({ searchParams: { user: "guest" } });
    render(ui);

    expect(mockGetAddressByIdAction).not.toHaveBeenCalled();
    expect(screen.getByTestId("checkout-form")).toHaveTextContent(
      "user:null address:null",
    );
    expect(componentMocks.CheckoutForm).toHaveBeenCalledWith(
      expect.objectContaining({ userId: null, address: null }),
      undefined,
    );
  });

  it("fetches and passes address for authenticated user when lookup succeeds", async () => {
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
    mockGetAddressByIdAction.mockResolvedValue({
      success: true,
      message: "ok",
      data: address,
    });

    const ui = await CheckoutPage({ searchParams: { user: "user-1" } });
    render(ui);

    expect(mockGetAddressByIdAction).toHaveBeenCalledWith("user-1");
    expect(screen.getByTestId("checkout-form")).toHaveTextContent(
      "user:user-1 address:addr-1",
    );
    expect(componentMocks.CheckoutForm).toHaveBeenCalledWith(
      expect.objectContaining({ userId: "user-1", address }),
      undefined,
    );
  });

  it("passes null address for authenticated user when lookup fails", async () => {
    mockGetAddressByIdAction.mockResolvedValue({
      success: false,
      message: "not found",
    });

    const ui = await CheckoutPage({ searchParams: { user: "user-1" } });
    render(ui);

    expect(mockGetAddressByIdAction).toHaveBeenCalledWith("user-1");
    expect(screen.getByTestId("checkout-form")).toHaveTextContent(
      "user:user-1 address:null",
    );
    expect(componentMocks.CheckoutForm).toHaveBeenCalledWith(
      expect.objectContaining({ userId: "user-1", address: null }),
      undefined,
    );
  });

  it("defaults to guest when user search param is missing", async () => {
    const ui = await CheckoutPage({ searchParams: {} as { user: string } });
    render(ui);

    expect(mockGetAddressByIdAction).not.toHaveBeenCalled();
    expect(screen.getByTestId("checkout-form")).toHaveTextContent(
      "user:null address:null",
    );
  });
});
