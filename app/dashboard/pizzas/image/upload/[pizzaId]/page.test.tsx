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

vi.mock("../../../_actions/getPizzaByIdAction", () => ({
  getPizzaByIdAction: vi.fn(),
}));

vi.mock("@/shared/Components/ServerError", () => ({
  default: componentMocks.ServerError,
}));

vi.mock("@/shared/Components/ImageForm", () => ({
  default: componentMocks.ImageForm,
}));

vi.mock("../../../_actions/updatePizzaImageAction", () => ({
  updatePizzaImageAction: vi.fn(),
}));

vi.mock("../../../_actions/uploadPizzaImageAction", () => ({
  uploadPizzaImageAction: vi.fn(),
}));

import UploadPizzaImagePage from "./page";
import { getPizzaByIdAction } from "../../../_actions/getPizzaByIdAction";
import { updatePizzaImageAction } from "../../../_actions/updatePizzaImageAction";
import { uploadPizzaImageAction } from "../../../_actions/uploadPizzaImageAction";

const mockGetPizzaByIdAction = getPizzaByIdAction as unknown as Mock;

const mockPizza = {
  id: "p1",
  pizzaName: "margherita",
  pizzaPrice32: 2000,
  pizzaPrice45: 3000,
  pizzaDescription: "classic",
  isAvailableOnMenu: true,
  image: {
    id: "img1",
    pizzaId: "p1",
    publicId: "cloud-id",
    publicUrl: "https://img.url/pizza.png",
    originalName: "pizza.png",
  },
};

describe("UploadPizzaImagePage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders ServerError when action fails", async () => {
    mockGetPizzaByIdAction.mockResolvedValue({
      success: false,
      message: "Pizza nem található!",
    });

    render(
      await UploadPizzaImagePage({
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
      await UploadPizzaImagePage({
        params: Promise.resolve({ pizzaId: "p1" }),
      }),
    );

    expect(screen.getByTestId("server-error")).toBeInTheDocument();
  });

  it("renders ImageForm with correct props on success", async () => {
    mockGetPizzaByIdAction.mockResolvedValue({
      success: true,
      message: "ok",
      data: mockPizza,
    });

    render(
      await UploadPizzaImagePage({
        params: Promise.resolve({ pizzaId: "p1" }),
      }),
    );

    expect(screen.getByTestId("image-form")).toHaveTextContent(
      "/dashboard/pizzas|p1|true|true",
    );

    expect(componentMocks.ImageForm).toHaveBeenCalledWith(
      expect.objectContaining({
        returnUrl: "/dashboard/pizzas",
        menuObject: mockPizza,
        updateImageAction: updatePizzaImageAction,
        uploadImageAction: uploadPizzaImageAction,
      }),
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
      await UploadPizzaImagePage({
        params: Promise.resolve({ pizzaId: "p123" }),
      }),
    );

    expect(mockGetPizzaByIdAction).toHaveBeenCalledWith("p123");
  });
});
