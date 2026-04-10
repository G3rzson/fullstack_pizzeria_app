import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import PizzaList from "./PizzaList";

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

vi.mock("../_actions/getAllAvailablePizzaAction", () => ({
  getAllAvailablePizzaAction: vi.fn(),
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

import { getAllAvailablePizzaAction } from "../_actions/getAllAvailablePizzaAction";

const mockGetAllAvailablePizzaAction =
  getAllAvailablePizzaAction as unknown as Mock;

describe("PizzaList component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders server error when action fails", async () => {
    mockGetAllAvailablePizzaAction.mockResolvedValue({
      success: false,
      message: "server error",
    });

    render(await PizzaList());

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

  it("renders empty list when there are no available pizzas", async () => {
    mockGetAllAvailablePizzaAction.mockResolvedValue({
      success: true,
      message: "ok",
      data: [],
    });

    render(await PizzaList());

    expect(screen.getByTestId("empty-list")).toHaveTextContent(
      "Jelenleg nincs elérhető pizza!",
    );
    expect(componentMocks.EmptyList).toHaveBeenCalledWith(
      expect.objectContaining({ text: "Jelenleg nincs elérhető pizza!" }),
      undefined,
    );
  });

  it("renders available pizzas via MenuListItem", async () => {
    mockGetAllAvailablePizzaAction.mockResolvedValue({
      success: true,
      message: "ok",
      data: [
        {
          id: "pizza-1",
          pizzaName: "margherita",
          pizzaPrice32: 2990,
          pizzaPrice45: 4590,
          pizzaDescription: "classic",
          image: { publicUrl: "/pizzas/margherita.jpg" },
        },
        {
          id: "pizza-2",
          pizzaName: "diavola",
          pizzaPrice32: 3490,
          pizzaPrice45: 5190,
          pizzaDescription: "spicy",
          image: null,
        },
      ],
    });

    render(await PizzaList());

    expect(screen.getAllByTestId("menu-list-item")).toHaveLength(2);
    expect(componentMocks.MenuListItem).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        menuArray: expect.objectContaining({
          id: "pizza-1",
          pizzaName: "margherita",
        }),
      }),
      undefined,
    );
    expect(componentMocks.MenuListItem).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        menuArray: expect.objectContaining({
          id: "pizza-2",
          pizzaName: "diavola",
        }),
      }),
      undefined,
    );
  });

  it("renders server error when action returns missing data", async () => {
    mockGetAllAvailablePizzaAction.mockResolvedValue({
      success: true,
      message: "missing data",
    });

    render(await PizzaList());

    expect(screen.getByTestId("server-error")).toHaveTextContent(
      "missing data|/|Vissza a főoldalra",
    );
  });
});
