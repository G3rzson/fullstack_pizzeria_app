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
  PastaForm: vi.fn(({ pastaObject }: { pastaObject: { id: string } }) => (
    <div data-testid="pasta-form">form:{pastaObject.id}</div>
  )),
}));

vi.mock("../../_actions/getPastaByIdAction", () => ({
  getPastaByIdAction: vi.fn(),
}));

vi.mock("@/shared/Components/ServerError", () => ({
  default: componentMocks.ServerError,
}));

vi.mock("../../_components/PastaForm", () => ({
  default: componentMocks.PastaForm,
}));

import EditPastaPage from "./page";
import { getPastaByIdAction } from "../../_actions/getPastaByIdAction";

const mockGetPastaByIdAction = getPastaByIdAction as unknown as Mock;

const mockPasta = {
  id: "t1",
  pastaName: "carbonara",
  pastaPrice: 2800,
  pastaDescription: "classic",
  isAvailableOnMenu: true,
  image: null,
};

describe("EditPastaPage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders ServerError when action fails", async () => {
    mockGetPastaByIdAction.mockResolvedValue({
      success: false,
      message: "Tészta nem található!",
    });

    render(
      await EditPastaPage({
        params: Promise.resolve({ pastaId: "t1" }),
      }),
    );

    expect(screen.getByTestId("server-error")).toHaveTextContent(
      "Tészta nem található!|/dashboard/pastas|Vissza a tésztákhoz",
    );
    expect(componentMocks.ServerError).toHaveBeenCalledWith(
      expect.objectContaining({
        errorMsg: "Tészta nem található!",
        path: "/dashboard/pastas",
        title: "Vissza a tésztákhoz",
      }),
      undefined,
    );
  });

  it("renders ServerError when action returns no data", async () => {
    mockGetPastaByIdAction.mockResolvedValue({
      success: true,
      message: "ok",
      data: null,
    });

    render(
      await EditPastaPage({
        params: Promise.resolve({ pastaId: "t1" }),
      }),
    );

    expect(screen.getByTestId("server-error")).toBeInTheDocument();
  });

  it("renders PastaForm with pasta data on success", async () => {
    mockGetPastaByIdAction.mockResolvedValue({
      success: true,
      message: "ok",
      data: mockPasta,
    });

    render(
      await EditPastaPage({
        params: Promise.resolve({ pastaId: "t1" }),
      }),
    );

    expect(screen.getByTestId("pasta-form")).toHaveTextContent("form:t1");
    expect(componentMocks.PastaForm).toHaveBeenCalledWith(
      expect.objectContaining({ pastaObject: mockPasta }),
      undefined,
    );
  });

  it("calls getPastaByIdAction with correct pastaId", async () => {
    mockGetPastaByIdAction.mockResolvedValue({
      success: true,
      message: "ok",
      data: mockPasta,
    });

    render(
      await EditPastaPage({
        params: Promise.resolve({ pastaId: "t123" }),
      }),
    );

    expect(mockGetPastaByIdAction).toHaveBeenCalledWith("t123");
  });
});
