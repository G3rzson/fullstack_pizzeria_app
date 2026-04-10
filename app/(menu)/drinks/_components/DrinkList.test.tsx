import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import DrinkList from "./DrinkList";

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
  EmptyList: vi.fn(({ text }: { text: string }) => (
    <div data-testid="empty-list">{text}</div>
  )),
  MenuListItem: vi.fn(({ menuArray }: { menuArray: { id: string } }) => (
    <li data-testid="menu-list-item">item:{menuArray.id}</li>
  )),
}));

vi.mock("../_actions/getAllAvailableDrinkAction", () => ({
  getAllAvailableDrinkAction: vi.fn(),
}));

vi.mock("@/shared/Components/ServerError", () => ({
  default: componentMocks.ServerError,
}));

vi.mock("@/shared/Components/EmptyList", () => ({
  default: componentMocks.EmptyList,
}));

vi.mock("@/shared/Components/MenuListItem", () => ({
  default: componentMocks.MenuListItem,
}));

import { getAllAvailableDrinkAction } from "../_actions/getAllAvailableDrinkAction";

const mockGetAllAvailableDrinkAction =
  getAllAvailableDrinkAction as unknown as Mock;

describe("DrinkList component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders server error when action fails", async () => {
    mockGetAllAvailableDrinkAction.mockResolvedValue({
      success: false,
      message: "server error",
    });

    render(await DrinkList());

    expect(screen.getByTestId("server-error")).toHaveTextContent(
      "server error|/|Vissza a főoldalra",
    );
    expect(componentMocks.ServerError).toHaveBeenCalledWith(
      expect.objectContaining({
        errorMsg: "server error",
        path: "/",
        title: "Vissza a főoldalra",
      }),
      undefined,
    );
  });

  it("renders empty list when there are no available drinks", async () => {
    mockGetAllAvailableDrinkAction.mockResolvedValue({
      success: true,
      message: "ok",
      data: [],
    });

    render(await DrinkList());

    expect(screen.getByTestId("empty-list")).toHaveTextContent(
      "Jelenleg nincs elérhető ital!",
    );
    expect(componentMocks.EmptyList).toHaveBeenCalledWith(
      expect.objectContaining({ text: "Jelenleg nincs elérhető ital!" }),
      undefined,
    );
  });

  it("renders available drinks via MenuListItem", async () => {
    mockGetAllAvailableDrinkAction.mockResolvedValue({
      success: true,
      message: "ok",
      data: [
        {
          id: "drink-1",
          drinkName: "cola",
          drinkPrice: 550,
          isAvailableOnMenu: true,
          image: { publicUrl: "/drinks/cola.jpg" },
        },
        {
          id: "drink-2",
          drinkName: "water",
          drinkPrice: 350,
          isAvailableOnMenu: true,
          image: null,
        },
      ],
    });

    render(await DrinkList());

    expect(screen.getAllByTestId("menu-list-item")).toHaveLength(2);
    expect(componentMocks.MenuListItem).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        menuArray: expect.objectContaining({
          id: "drink-1",
          drinkName: "cola",
        }),
      }),
      undefined,
    );
    expect(componentMocks.MenuListItem).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        menuArray: expect.objectContaining({
          id: "drink-2",
          drinkName: "water",
        }),
      }),
      undefined,
    );
  });

  it("renders server error when action returns missing data", async () => {
    mockGetAllAvailableDrinkAction.mockResolvedValue({
      success: true,
      message: "missing data",
    });

    render(await DrinkList());

    expect(screen.getByTestId("server-error")).toHaveTextContent(
      "missing data|/|Vissza a főoldalra",
    );
  });
});
