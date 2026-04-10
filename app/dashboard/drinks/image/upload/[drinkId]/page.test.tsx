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

vi.mock("../../../_actions/getDrinkByIdAction", () => ({
  getDrinkByIdAction: vi.fn(),
}));

vi.mock("@/shared/Components/ServerError", () => ({
  default: componentMocks.ServerError,
}));

vi.mock("@/shared/Components/ImageForm", () => ({
  default: componentMocks.ImageForm,
}));

vi.mock("../../../_actions/updateDrinkImageAction", () => ({
  updateDrinkImageAction: vi.fn(),
}));

vi.mock("../../../_actions/uploadDrinkImageAction", () => ({
  uploadDrinkImageAction: vi.fn(),
}));

import UploadDrinkImagePage from "./page";
import { getDrinkByIdAction } from "../../../_actions/getDrinkByIdAction";
import { updateDrinkImageAction } from "../../../_actions/updateDrinkImageAction";
import { uploadDrinkImageAction } from "../../../_actions/uploadDrinkImageAction";

const mockGetDrinkByIdAction = getDrinkByIdAction as unknown as Mock;

const mockDrink = {
  id: "d1",
  drinkName: "cola",
  drinkPrice: 500,
  isAvailableOnMenu: true,
  image: {
    id: "img1",
    drinkId: "d1",
    publicId: "cloud-id",
    publicUrl: "https://img.url/cola.png",
    originalName: "cola.png",
  },
};

describe("UploadDrinkImagePage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders ServerError when action fails", async () => {
    mockGetDrinkByIdAction.mockResolvedValue({
      success: false,
      message: "Ital nem található!",
    });

    render(
      await UploadDrinkImagePage({
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
      await UploadDrinkImagePage({
        params: Promise.resolve({ drinkId: "d1" }),
      }),
    );

    expect(screen.getByTestId("server-error")).toBeInTheDocument();
  });

  it("renders ImageForm with correct props on success", async () => {
    mockGetDrinkByIdAction.mockResolvedValue({
      success: true,
      message: "ok",
      data: mockDrink,
    });

    render(
      await UploadDrinkImagePage({
        params: Promise.resolve({ drinkId: "d1" }),
      }),
    );

    expect(screen.getByTestId("image-form")).toHaveTextContent(
      "/dashboard/drinks|d1|true|true",
    );

    expect(componentMocks.ImageForm).toHaveBeenCalledWith(
      expect.objectContaining({
        returnUrl: "/dashboard/drinks",
        menuObject: mockDrink,
        updateImageAction: updateDrinkImageAction,
        uploadImageAction: uploadDrinkImageAction,
      }),
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
      await UploadDrinkImagePage({
        params: Promise.resolve({ drinkId: "d123" }),
      }),
    );

    expect(mockGetDrinkByIdAction).toHaveBeenCalledWith("d123");
  });
});
