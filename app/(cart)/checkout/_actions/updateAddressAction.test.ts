import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { updateAddressAction } from "./updateAddressAction";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";

vi.mock("@/shared/Functions/handleResponse", () => ({
  handleResponse: vi.fn((success: boolean, message: string, data?: unknown) =>
    data === undefined ? { success, message } : { success, message, data },
  ),
}));

vi.mock("../_dal/addressDal", () => ({
  updateAddressDal: vi.fn(),
}));

vi.mock("@/shared/Functions/idValidator", () => ({
  idValidator: { safeParseAsync: vi.fn() },
}));

vi.mock("../_validation/checkoutSchema", () => ({
  checkoutSchema: { safeParseAsync: vi.fn() },
}));

vi.mock("@/shared/Functions/errorLogger", () => ({
  errorLogger: vi.fn(),
}));

vi.mock("@/shared/Functions/isDev", () => ({
  default: vi.fn(),
}));

import { handleResponse } from "@/shared/Functions/handleResponse";
import { updateAddressDal } from "../_dal/addressDal";
import { idValidator } from "@/shared/Functions/idValidator";
import { checkoutSchema } from "../_validation/checkoutSchema";
import { errorLogger } from "@/shared/Functions/errorLogger";
import isDev from "@/shared/Functions/isDev";

const mockHandleResponse = handleResponse as unknown as Mock;
const mockUpdateAddressDal = updateAddressDal as unknown as Mock;
const mockSafeParseAsync = idValidator.safeParseAsync as unknown as Mock;
const mockCheckoutSafeParseAsync =
  checkoutSchema.safeParseAsync as unknown as Mock;
const mockErrorLogger = errorLogger as unknown as Mock;
const mockIsDev = isDev as unknown as Mock;

describe("updateAddressAction", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns invalid id when user id is invalid", async () => {
    mockSafeParseAsync.mockResolvedValue({ success: false });

    const result = await updateAddressAction("bad-id", {});

    expect(mockSafeParseAsync).toHaveBeenCalledWith({ id: "bad-id" });
    expect(mockCheckoutSafeParseAsync).not.toHaveBeenCalled();
    expect(mockUpdateAddressDal).not.toHaveBeenCalled();
    expect(mockHandleResponse).toHaveBeenCalledWith(
      false,
      BACKEND_RESPONSE_MESSAGES.INVALID_ID,
    );
    expect(result).toEqual({
      success: false,
      message: BACKEND_RESPONSE_MESSAGES.INVALID_ID,
    });
  });

  it("returns invalid data when checkout schema fails", async () => {
    mockSafeParseAsync.mockResolvedValue({
      success: true,
      data: { id: "user-1" },
    });
    mockCheckoutSafeParseAsync.mockResolvedValue({ success: false });

    const result = await updateAddressAction("user-1", {});

    expect(mockUpdateAddressDal).not.toHaveBeenCalled();
    expect(mockHandleResponse).toHaveBeenCalledWith(
      false,
      BACKEND_RESPONSE_MESSAGES.INVALID_DATA,
    );
    expect(result).toEqual({
      success: false,
      message: BACKEND_RESPONSE_MESSAGES.INVALID_DATA,
    });
  });

  it("updates address and returns success", async () => {
    mockSafeParseAsync.mockResolvedValue({
      success: true,
      data: { id: "user-1" },
    });
    mockCheckoutSafeParseAsync.mockResolvedValue({
      success: true,
      data: {
        fullName: "Teszt Elek",
        phoneNumber: "+36301234567",
        postalCode: "1111",
        city: "Budapest",
        street: "Fo utca",
        houseNumber: "12",
        floor: "",
        saveAddress: false,
      },
    });

    const result = await updateAddressAction("user-1", {});

    expect(mockUpdateAddressDal).toHaveBeenCalledWith("user-1", {
      fullName: "Teszt Elek",
      phoneNumber: "+36301234567",
      postalCode: "1111",
      city: "Budapest",
      street: "Fo utca",
      houseNumber: "12",
      floorAndDoor: null,
      isSaved: false,
    });
    expect(mockHandleResponse).toHaveBeenCalledWith(
      true,
      BACKEND_RESPONSE_MESSAGES.SUCCESS,
    );
    expect(result).toEqual({
      success: true,
      message: BACKEND_RESPONSE_MESSAGES.SUCCESS,
    });
  });

  it("logs with errorLogger in dev mode and returns server error", async () => {
    const error = new Error("db error");
    mockSafeParseAsync.mockRejectedValue(error);
    mockIsDev.mockReturnValue(true);

    const result = await updateAddressAction("user-1", {});

    expect(mockErrorLogger).toHaveBeenCalledWith(
      error,
      "server error - updateAddressAction",
    );
    expect(mockHandleResponse).toHaveBeenCalledWith(
      false,
      BACKEND_RESPONSE_MESSAGES.SERVER_ERROR,
    );
    expect(result).toEqual({
      success: false,
      message: BACKEND_RESPONSE_MESSAGES.SERVER_ERROR,
    });
  });

  it("logs with console.error in non-dev mode and returns server error", async () => {
    const error = new Error("db error");
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockSafeParseAsync.mockRejectedValue(error);
    mockIsDev.mockReturnValue(false);

    const result = await updateAddressAction("user-1", {});

    expect(mockErrorLogger).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith("Error updating address:", error);
    expect(mockHandleResponse).toHaveBeenCalledWith(
      false,
      BACKEND_RESPONSE_MESSAGES.SERVER_ERROR,
    );
    expect(result).toEqual({
      success: false,
      message: BACKEND_RESPONSE_MESSAGES.SERVER_ERROR,
    });

    consoleSpy.mockRestore();
  });
});
