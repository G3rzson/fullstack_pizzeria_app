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
  DrinkListItem: vi.fn(({ drink }: { drink: { id: string } }) => (
    <li data-testid="drink-list-item">item:{drink.id}</li>
  )),
}));

vi.mock("../_actions/getAllDrinkAction", () => ({
  getAllDrinkAction: vi.fn(),
}));

vi.mock("@/shared/Components/ServerError", () => ({
  default: componentMocks.ServerError,
}));

vi.mock("./DrinkListItem", () => ({
  default: componentMocks.DrinkListItem,
}));

import DrinkList from "./DrinkList";
import { getAllDrinkAction } from "../_actions/getAllDrinkAction";

const mockGetAllDrinkAction = getAllDrinkAction as unknown as Mock;

const mockDrink = {
  id: "d1",
  drinkName: "cola",
  drinkPrice: 500,
  isAvailableOnMenu: true,
  image: null,
};

describe("DrinkList component (dashboard)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders ServerError when action fails", async () => {
    mockGetAllDrinkAction.mockResolvedValue({
      success: false,
      message: "server error",
    });

    render(await DrinkList());

    expect(screen.getByTestId("server-error")).toHaveTextContent(
      "server error|/dashboard|Vissza a dashboardra",
    );
    expect(componentMocks.ServerError).toHaveBeenCalledWith(
      expect.objectContaining({
        errorMsg: "server error",
        path: "/dashboard",
        title: "Vissza a dashboardra",
      }),
      undefined,
    );
  });

  it("renders empty message when drink list is empty", async () => {
    mockGetAllDrinkAction.mockResolvedValue({
      success: true,
      message: "ok",
      data: [],
    });

    render(await DrinkList());

    expect(
      screen.getByText("Jelenleg nincs elérhető ital."),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("drink-list-item")).not.toBeInTheDocument();
  });

  it("renders DrinkListItem for each drink", async () => {
    mockGetAllDrinkAction.mockResolvedValue({
      success: true,
      message: "ok",
      data: [mockDrink, { ...mockDrink, id: "d2" }],
    });

    render(await DrinkList());

    const items = screen.getAllByTestId("drink-list-item");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("item:d1");
    expect(items[1]).toHaveTextContent("item:d2");
  });

  it("passes correct drink prop to DrinkListItem", async () => {
    mockGetAllDrinkAction.mockResolvedValue({
      success: true,
      message: "ok",
      data: [mockDrink],
    });

    render(await DrinkList());

    expect(componentMocks.DrinkListItem).toHaveBeenCalledWith(
      expect.objectContaining({ drink: mockDrink }),
      undefined,
    );
  });
});
