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
  ImageForm: vi.fn(
    ({
      returnUrl,
      menuObject,
      updateImageAction,
      uploadImageAction,
    }: {
      returnUrl: string;
      menuObject: { id: string };
      updateImageAction: unknown;
      uploadImageAction: unknown;
    }) => (
      <div data-testid="image-form">
        {returnUrl}|{menuObject.id}|{String(Boolean(updateImageAction))}|
        {String(Boolean(uploadImageAction))}
      </div>
    ),
  ),
}));

vi.mock("../../../_actions/getPastaByIdAction", () => ({
  getPastaByIdAction: vi.fn(),
}));

vi.mock("@/shared/Components/ServerError", () => ({
  default: componentMocks.ServerError,
}));

vi.mock("@/shared/Components/ImageForm", () => ({
  default: componentMocks.ImageForm,
}));

vi.mock("../../../_actions/updatePastaImageAction", () => ({
  updatePastaImageAction: vi.fn(),
}));

vi.mock("../../../_actions/uploadPastaImageAction", () => ({
  uploadPastaImageAction: vi.fn(),
}));

import UploadPastaImagePage from "./page";
import { getPastaByIdAction } from "../../../_actions/getPastaByIdAction";
import { updatePastaImageAction } from "../../../_actions/updatePastaImageAction";
import { uploadPastaImageAction } from "../../../_actions/uploadPastaImageAction";

const mockGetPastaByIdAction = getPastaByIdAction as unknown as Mock;

const mockPasta = {
  id: "t1",
  pastaName: "carbonara",
  pastaPrice: 2800,
  pastaDescription: "classic",
  isAvailableOnMenu: true,
  image: {
    id: "img1",
    pastaId: "t1",
    publicId: "cloud-id",
    publicUrl: "https://img.url/pasta.png",
    originalName: "pasta.png",
  },
};

describe("UploadPastaImagePage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders ServerError when action fails", async () => {
    mockGetPastaByIdAction.mockResolvedValue({
      success: false,
      message: "Tészta nem található!",
    });

    render(
      await UploadPastaImagePage({
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
      await UploadPastaImagePage({
        params: Promise.resolve({ pastaId: "t1" }),
      }),
    );

    expect(screen.getByTestId("server-error")).toBeInTheDocument();
  });

  it("renders ImageForm with correct props on success", async () => {
    mockGetPastaByIdAction.mockResolvedValue({
      success: true,
      message: "ok",
      data: mockPasta,
    });

    render(
      await UploadPastaImagePage({
        params: Promise.resolve({ pastaId: "t1" }),
      }),
    );

    expect(screen.getByTestId("image-form")).toHaveTextContent(
      "/dashboard/pastas|t1|true|true",
    );

    expect(componentMocks.ImageForm).toHaveBeenCalledWith(
      expect.objectContaining({
        returnUrl: "/dashboard/pastas",
        menuObject: mockPasta,
        updateImageAction: updatePastaImageAction,
        uploadImageAction: uploadPastaImageAction,
      }),
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
      await UploadPastaImagePage({
        params: Promise.resolve({ pastaId: "t123" }),
      }),
    );

    expect(mockGetPastaByIdAction).toHaveBeenCalledWith("t123");
  });
});
