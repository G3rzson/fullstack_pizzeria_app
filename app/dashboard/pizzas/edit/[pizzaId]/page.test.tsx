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
  PizzaForm: vi.fn(({ pizzaObject }: { pizzaObject: { id: string } }) => (
    <div data-testid="pizza-form">form:{pizzaObject.id}</div>
  )),
}));

vi.mock("../../_actions/getPizzaByIdAction", () => ({
  getPizzaByIdAction: vi.fn(),
}));

vi.mock("@/shared/Components/ServerError", () => ({
  default: componentMocks.ServerError,
}));

vi.mock("../../_components/PizzaForm", () => ({
  default: componentMocks.PizzaForm,
}));

import EditPizzaPage from "./page";
import { getPizzaByIdAction } from "../../_actions/getPizzaByIdAction";

const mockGetPizzaByIdAction = getPizzaByIdAction as unknown as Mock;

const mockPizza = {
  id: "p1",
  pizzaName: "margherita",
  pizzaPrice32: 2000,
  pizzaPrice45: 3000,
  pizzaDescription: "classic",
  isAvailableOnMenu: true,
  image: null,
};

describe("EditPizzaPage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders ServerError when action fails", async () => {
    mockGetPizzaByIdAction.mockResolvedValue({
      success: false,
      message: "Pizza nem található!",
    });

    render(
      await EditPizzaPage({
        params: Promise.resolve({ pizzaId: "p1" }),
      }),
    );

    expect(screen.getByTestId("server-error")).toHaveTextContent(
      "Pizza nem található!|/dashboard/pizzas|Vissza a pizzákhoz",
    );
    expect(componentMocks.ServerError).toHaveBeenCalledWith(
      expect.objectContaining({
        errorMsg: "Pizza nem található!",
        path: "/dashboard/pizzas",
        title: "Vissza a pizzákhoz",
      }),
      undefined,
    );
  });

  it("renders ServerError when action returns no data", async () => {
    mockGetPizzaByIdAction.mockResolvedValue({
      success: true,
      message: "ok",
      data: null,
    });

    render(
      await EditPizzaPage({
        params: Promise.resolve({ pizzaId: "p1" }),
      }),
    );

    expect(screen.getByTestId("server-error")).toBeInTheDocument();
  });

  it("renders PizzaForm with pizza data on success", async () => {
    mockGetPizzaByIdAction.mockResolvedValue({
      success: true,
      message: "ok",
      data: mockPizza,
    });

    render(
      await EditPizzaPage({
        params: Promise.resolve({ pizzaId: "p1" }),
      }),
    );

    expect(screen.getByTestId("pizza-form")).toHaveTextContent("form:p1");
    expect(componentMocks.PizzaForm).toHaveBeenCalledWith(
      expect.objectContaining({ pizzaObject: mockPizza }),
      undefined,
    );
  });

  it("calls getPizzaByIdAction with correct pizzaId", async () => {
    mockGetPizzaByIdAction.mockResolvedValue({
      success: true,
      message: "ok",
      data: mockPizza,
    });

    render(
      await EditPizzaPage({
        params: Promise.resolve({ pizzaId: "p123" }),
      }),
    );

    expect(mockGetPizzaByIdAction).toHaveBeenCalledWith("p123");
  });
});
