import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import PastaList from "./PastaList";

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

vi.mock("../_actions/getAllAvailablePastaAction", () => ({
  getAllAvailablePastaAction: vi.fn(),
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

import { getAllAvailablePastaAction } from "../_actions/getAllAvailablePastaAction";

const mockGetAllAvailablePastaAction =
  getAllAvailablePastaAction as unknown as Mock;

describe("PastaList component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders server error when action fails", async () => {
    mockGetAllAvailablePastaAction.mockResolvedValue({
      success: false,
      message: "server error",
    });

    render(await PastaList());

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

  it("renders empty list when there are no available pastas", async () => {
    mockGetAllAvailablePastaAction.mockResolvedValue({
      success: true,
      message: "ok",
      data: [],
    });

    render(await PastaList());

    expect(screen.getByTestId("empty-list")).toHaveTextContent(
      "Jelenleg nincs elérhető tészta!",
    );
    expect(componentMocks.EmptyList).toHaveBeenCalledWith(
      expect.objectContaining({ text: "Jelenleg nincs elérhető tészta!" }),
      undefined,
    );
  });

  it("renders available pastas via MenuListItem", async () => {
    mockGetAllAvailablePastaAction.mockResolvedValue({
      success: true,
      message: "ok",
      data: [
        {
          id: "pasta-1",
          pastaName: "carbonara",
          pastaPrice: 2890,
          pastaDescription: "creamy",
          image: { publicUrl: "/pastas/carbonara.jpg" },
        },
        {
          id: "pasta-2",
          pastaName: "arrabbiata",
          pastaPrice: 2590,
          pastaDescription: "spicy",
          image: null,
        },
      ],
    });

    render(await PastaList());

    expect(screen.getAllByTestId("menu-list-item")).toHaveLength(2);
    expect(componentMocks.MenuListItem).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        menuArray: expect.objectContaining({
          id: "pasta-1",
          pastaName: "carbonara",
        }),
      }),
      undefined,
    );
    expect(componentMocks.MenuListItem).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        menuArray: expect.objectContaining({
          id: "pasta-2",
          pastaName: "arrabbiata",
        }),
      }),
      undefined,
    );
  });

  it("renders server error when action returns missing data", async () => {
    mockGetAllAvailablePastaAction.mockResolvedValue({
      success: true,
      message: "missing data",
    });

    render(await PastaList());

    expect(screen.getByTestId("server-error")).toHaveTextContent(
      "missing data|/|Vissza a főoldalra",
    );
  });
});
