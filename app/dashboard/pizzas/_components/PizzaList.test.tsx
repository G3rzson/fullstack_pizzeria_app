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
  EmptyList: vi.fn(({ text }: { text: string }) => (
    <div data-testid="empty-list">{text}</div>
  )),
  PizzaListItem: vi.fn(({ pizza }: { pizza: { id: string } }) => (
    <li data-testid="pizza-list-item">item:{pizza.id}</li>
  )),
}));

vi.mock("../_actions/getAllPizzaAction", () => ({
  getAllPizzaAction: vi.fn(),
}));

vi.mock("@/shared/Components/ServerError", () => ({
  default: componentMocks.ServerError,
}));

vi.mock("@/shared/Components/EmptyList", () => ({
  default: componentMocks.EmptyList,
}));

vi.mock("./PizzaListItem", () => ({
  default: componentMocks.PizzaListItem,
}));

import PizzaList from "./PizzaList";
import { getAllPizzaAction } from "../_actions/getAllPizzaAction";

const mockGetAllPizzaAction = getAllPizzaAction as unknown as Mock;

const mockPizza = {
  id: "p1",
  pizzaName: "margherita",
  pizzaPrice32: 2000,
  pizzaPrice45: 3000,
  pizzaDescription: "classic",
  isAvailableOnMenu: true,
  image: null,
};

describe("PizzaList component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders server error when action fails", async () => {
    mockGetAllPizzaAction.mockResolvedValue({
      success: false,
      message: "server error",
    });

    render(await PizzaList());

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

  it("renders empty list when there are no pizzas", async () => {
    mockGetAllPizzaAction.mockResolvedValue({
      success: true,
      message: "ok",
      data: [],
    });

    render(await PizzaList());

    expect(screen.getByTestId("empty-list")).toHaveTextContent(
      "Jelenleg nincs elérhető pizza!",
    );
    expect(screen.queryByTestId("pizza-list-item")).not.toBeInTheDocument();
  });

  it("renders PizzaListItem for each pizza", async () => {
    mockGetAllPizzaAction.mockResolvedValue({
      success: true,
      message: "ok",
      data: [mockPizza, { ...mockPizza, id: "p2" }],
    });

    render(await PizzaList());

    const items = screen.getAllByTestId("pizza-list-item");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("item:p1");
    expect(items[1]).toHaveTextContent("item:p2");
  });

  it("passes correct pizza prop to PizzaListItem", async () => {
    mockGetAllPizzaAction.mockResolvedValue({
      success: true,
      message: "ok",
      data: [mockPizza],
    });

    render(await PizzaList());

    expect(componentMocks.PizzaListItem).toHaveBeenCalledWith(
      expect.objectContaining({ pizza: mockPizza }),
      undefined,
    );
  });
});
