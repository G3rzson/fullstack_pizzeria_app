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
  PastaListItem: vi.fn(({ pasta }: { pasta: { id: string } }) => (
    <li data-testid="pasta-list-item">item:{pasta.id}</li>
  )),
}));

vi.mock("../_actions/getAllPastaAction", () => ({
  getAllPastaAction: vi.fn(),
}));

vi.mock("@/shared/Components/ServerError", () => ({
  default: componentMocks.ServerError,
}));

vi.mock("@/shared/Components/EmptyList", () => ({
  default: componentMocks.EmptyList,
}));

vi.mock("./PastaListItem", () => ({
  default: componentMocks.PastaListItem,
}));

import PastaList from "./PastaList";
import { getAllPastaAction } from "../_actions/getAllPastaAction";

const mockGetAllPastaAction = getAllPastaAction as unknown as Mock;

const mockPasta = {
  id: "t1",
  pastaName: "carbonara",
  pastaPrice: 2800,
  pastaDescription: "classic",
  isAvailableOnMenu: true,
  image: null,
};

describe("PastaList component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders server error when action fails", async () => {
    mockGetAllPastaAction.mockResolvedValue({
      success: false,
      message: "server error",
    });

    render(await PastaList());

    expect(screen.getByTestId("server-error")).toHaveTextContent(
      "server error|/dashboard|Vissza a főoldalra",
    );
    expect(componentMocks.ServerError).toHaveBeenCalledWith(
      expect.objectContaining({
        errorMsg: "server error",
        path: "/dashboard",
        title: "Vissza a főoldalra",
      }),
      undefined,
    );
  });

  it("renders empty list when there are no pastas", async () => {
    mockGetAllPastaAction.mockResolvedValue({
      success: true,
      message: "ok",
      data: [],
    });

    render(await PastaList());

    expect(screen.getByTestId("empty-list")).toHaveTextContent(
      "Jelenleg nincs elérhető tészta!",
    );
    expect(screen.queryByTestId("pasta-list-item")).not.toBeInTheDocument();
  });

  it("renders PastaListItem for each pasta", async () => {
    mockGetAllPastaAction.mockResolvedValue({
      success: true,
      message: "ok",
      data: [mockPasta, { ...mockPasta, id: "t2" }],
    });

    render(await PastaList());

    const items = screen.getAllByTestId("pasta-list-item");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("item:t1");
    expect(items[1]).toHaveTextContent("item:t2");
  });

  it("passes correct pasta prop to PastaListItem", async () => {
    mockGetAllPastaAction.mockResolvedValue({
      success: true,
      message: "ok",
      data: [mockPasta],
    });

    render(await PastaList());

    expect(componentMocks.PastaListItem).toHaveBeenCalledWith(
      expect.objectContaining({ pasta: mockPasta }),
      undefined,
    );
  });
});
