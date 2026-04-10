import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";

vi.mock("../_dal/pastaDal", () => ({
  getAllAvailablePastaDal: vi.fn(),
}));

vi.mock("@/shared/Functions/errorLogger", () => ({
  errorLogger: vi.fn(),
}));

vi.mock("@/shared/Functions/isDev", () => ({
  default: vi.fn(),
}));

import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";
import { errorLogger } from "@/shared/Functions/errorLogger";
import isDev from "@/shared/Functions/isDev";
import { getAllAvailablePastaDal } from "../_dal/pastaDal";
import { getAllAvailablePastaAction } from "./getAllAvailablePastaAction";

const mockGetAllAvailablePastaDal = getAllAvailablePastaDal as unknown as Mock;
const mockErrorLogger = errorLogger as unknown as Mock;
const mockIsDev = isDev as unknown as Mock;

describe("getAllAvailablePastaAction action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsDev.mockReturnValue(true);
  });

  it("returns mapped available pastas on success", async () => {
    mockGetAllAvailablePastaDal.mockResolvedValue([
      {
        id: "pasta-1",
        pastaName: "Carbonara",
        pastaPrice: 2890,
        pastaDescription: "Creamy sauce",
        isAvailableOnMenu: true,
        image: {
          publicUrl: "/pastas/carbonara.jpg",
        },
      },
      {
        id: "pasta-2",
        pastaName: "Arrabbiata",
        pastaPrice: 2590,
        pastaDescription: "Spicy tomato",
        isAvailableOnMenu: true,
        image: null,
      },
    ]);

    const result = await getAllAvailablePastaAction();

    expect(mockGetAllAvailablePastaDal).toHaveBeenCalledOnce();
    expect(result).toEqual({
      success: true,
      message: BACKEND_RESPONSE_MESSAGES.SUCCESS,
      data: [
        {
          id: "pasta-1",
          pastaName: "Carbonara",
          pastaPrice: 2890,
          pastaDescription: "Creamy sauce",
          image: {
            publicUrl: "/pastas/carbonara.jpg",
          },
        },
        {
          id: "pasta-2",
          pastaName: "Arrabbiata",
          pastaPrice: 2590,
          pastaDescription: "Spicy tomato",
          image: null,
        },
      ],
    });
  });

  it("logs with errorLogger in dev mode and returns server error", async () => {
    const error = new Error("db error");
    mockGetAllAvailablePastaDal.mockRejectedValue(error);
    mockIsDev.mockReturnValue(true);

    const result = await getAllAvailablePastaAction();

    expect(mockErrorLogger).toHaveBeenCalledWith(
      error,
      "server error - getAllAvailablePastaAction",
    );
    expect(result).toEqual({
      success: false,
      message: BACKEND_RESPONSE_MESSAGES.SERVER_ERROR,
    });
  });

  it("logs with console.error in non-dev mode and returns server error", async () => {
    const error = new Error("db error");
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockGetAllAvailablePastaDal.mockRejectedValue(error);
    mockIsDev.mockReturnValue(false);

    const result = await getAllAvailablePastaAction();

    expect(mockErrorLogger).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith("Error fetching pastas:", error);
    expect(result).toEqual({
      success: false,
      message: BACKEND_RESPONSE_MESSAGES.SERVER_ERROR,
    });

    consoleSpy.mockRestore();
  });
});
