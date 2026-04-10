import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";

const componentMocks = vi.hoisted(() => ({
  ServerError: vi.fn(
    ({
      errorMsg,
      path,
      title,
    }: {
      errorMsg: string;
      path: string;
      title: string;
    }) => (
      <div data-testid="server-error">
        {errorMsg}|{path}|{title}
      </div>
    ),
  ),
  DrinkForm: vi.fn(({ drinkObject }: { drinkObject: { id: string } }) => (
    <div data-testid="drink-form">form:{drinkObject.id}</div>
  )),
}));

vi.mock("../../_actions/getDrinkByIdAction", () => ({
  getDrinkByIdAction: vi.fn(),
}));

vi.mock("@/shared/Components/ServerError", () => ({
  default: componentMocks.ServerError,
}));

vi.mock("../../_components/DrinkForm", () => ({
  default: componentMocks.DrinkForm,
}));

import EditDrinkPage from "./page";
import { getDrinkByIdAction } from "../../_actions/getDrinkByIdAction";

const mockGetDrinkByIdAction = getDrinkByIdAction as unknown as Mock;

const mockDrink = {
  id: "d1",
  drinkName: "cola",
  drinkPrice: 500,
  isAvailableOnMenu: true,
  image: null,
};

describe("EditDrinkPage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders ServerError when action fails", async () => {
    mockGetDrinkByIdAction.mockResolvedValue({
      success: false,
      message: "Ital nem található!",
    });

    render(
      await EditDrinkPage({
        params: Promise.resolve({ drinkId: "d1" }),
      }),
    );

    expect(screen.getByTestId("server-error")).toHaveTextContent(
      "Ital nem található!|/dashboard/drinks|Vissza az italokhoz",
    );
    expect(componentMocks.ServerError).toHaveBeenCalledWith(
      expect.objectContaining({
        errorMsg: "Ital nem található!",
        path: "/dashboard/drinks",
        title: "Vissza az italokhoz",
      }),
      undefined,
    );
  });

  it("renders ServerError when action returns no data", async () => {
    mockGetDrinkByIdAction.mockResolvedValue({
      success: true,
      message: "ok",
      data: null,
    });

    render(
      await EditDrinkPage({
        params: Promise.resolve({ drinkId: "d1" }),
      }),
    );

    expect(screen.getByTestId("server-error")).toBeInTheDocument();
  });

  it("renders DrinkForm with drink data on success", async () => {
    mockGetDrinkByIdAction.mockResolvedValue({
      success: true,
      message: "ok",
      data: mockDrink,
    });

    render(
      await EditDrinkPage({
        params: Promise.resolve({ drinkId: "d1" }),
      }),
    );

    expect(screen.getByTestId("drink-form")).toHaveTextContent("form:d1");
    expect(componentMocks.DrinkForm).toHaveBeenCalledWith(
      expect.objectContaining({ drinkObject: mockDrink }),
      undefined,
    );
  });

  it("calls getDrinkByIdAction with correct drinkId", async () => {
    mockGetDrinkByIdAction.mockResolvedValue({
      success: true,
      message: "ok",
      data: mockDrink,
    });

    render(
      await EditDrinkPage({
        params: Promise.resolve({ drinkId: "d123" }),
      }),
    );

    expect(mockGetDrinkByIdAction).toHaveBeenCalledWith("d123");
  });
});
