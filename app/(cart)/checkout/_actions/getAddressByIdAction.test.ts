import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { getAddressByIdAction } from "./getAddressByIdAction";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";

vi.mock("@/shared/Functions/handleResponse", () => ({
  handleResponse: vi.fn((success: boolean, message: string, data?: unknown) =>
    data === undefined ? { success, message } : { success, message, data },
  ),
}));

vi.mock("../_dal/addressDal", () => ({
  getAddressByUserIdDal: vi.fn(),
}));

vi.mock("@/shared/Functions/idValidator", () => ({
  idValidator: { safeParseAsync: vi.fn() },
}));

vi.mock("@/shared/Functions/errorLogger", () => ({
  errorLogger: vi.fn(),
}));

vi.mock("@/shared/Functions/isDev", () => ({
  default: vi.fn(),
}));

import { handleResponse } from "@/shared/Functions/handleResponse";
import { getAddressByUserIdDal } from "../_dal/addressDal";
import { idValidator } from "@/shared/Functions/idValidator";
import { errorLogger } from "@/shared/Functions/errorLogger";
import isDev from "@/shared/Functions/isDev";

const mockHandleResponse = handleResponse as unknown as Mock;
const mockGetAddressByUserIdDal = getAddressByUserIdDal as unknown as Mock;
const mockSafeParseAsync = idValidator.safeParseAsync as unknown as Mock;
const mockErrorLogger = errorLogger as unknown as Mock;
const mockIsDev = isDev as unknown as Mock;

describe("getAddressByIdAction action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns invalid id response when id validation fails", async () => {
    mockSafeParseAsync.mockResolvedValue({ success: false });

    const result = await getAddressByIdAction("bad-id");

    expect(mockSafeParseAsync).toHaveBeenCalledWith({ id: "bad-id" });
    expect(mockGetAddressByUserIdDal).not.toHaveBeenCalled();
    expect(mockHandleResponse).toHaveBeenCalledWith(
      false,
      BACKEND_RESPONSE_MESSAGES.INVALID_ID,
    );
    expect(result).toEqual({
      success: false,
      message: BACKEND_RESPONSE_MESSAGES.INVALID_ID,
    });
  });

  it("returns not found when address is missing", async () => {
    mockSafeParseAsync.mockResolvedValue({
      success: true,
      data: { id: "user-1" },
    });
    mockGetAddressByUserIdDal.mockResolvedValue({ orderAddress: null });

    const result = await getAddressByIdAction("user-1");

    expect(mockGetAddressByUserIdDal).toHaveBeenCalledWith("user-1");
    expect(mockHandleResponse).toHaveBeenCalledWith(
      false,
      BACKEND_RESPONSE_MESSAGES.NOT_FOUND,
    );
    expect(result).toEqual({
      success: false,
      message: BACKEND_RESPONSE_MESSAGES.NOT_FOUND,
    });
  });

  it("returns mapped address dto on success", async () => {
    mockSafeParseAsync.mockResolvedValue({
      success: true,
      data: { id: "user-1" },
    });
    mockGetAddressByUserIdDal.mockResolvedValue({
      orderAddress: {
        id: "addr-1",
        fullName: "Teszt Elek",
        phoneNumber: "+36301234567",
        postalCode: "1111",
        city: "Budapest",
        street: "Fo utca",
        houseNumber: "12",
        floorAndDoor: null,
        isSaved: true,
      },
    });

    const result = await getAddressByIdAction("user-1");

    expect(mockHandleResponse).toHaveBeenCalledWith(
      true,
      BACKEND_RESPONSE_MESSAGES.SUCCESS,
      {
        id: "addr-1",
        fullName: "Teszt Elek",
        phoneNumber: "+36301234567",
        postalCode: "1111",
        city: "Budapest",
        street: "Fo utca",
        houseNumber: "12",
        floorAndDoor: null,
        isSaved: true,
      },
    );
    expect(result).toEqual({
      success: true,
      message: BACKEND_RESPONSE_MESSAGES.SUCCESS,
      data: {
        id: "addr-1",
        fullName: "Teszt Elek",
        phoneNumber: "+36301234567",
        postalCode: "1111",
        city: "Budapest",
        street: "Fo utca",
        houseNumber: "12",
        floorAndDoor: null,
        isSaved: true,
      },
    });
  });

  it("logs with errorLogger in dev mode and returns server error", async () => {
    const error = new Error("db error");
    mockSafeParseAsync.mockRejectedValue(error);
    mockIsDev.mockReturnValue(true);

    const result = await getAddressByIdAction("user-1");

    expect(mockErrorLogger).toHaveBeenCalledWith(
      error,
      "server error - getAddressByIdAction",
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

    const result = await getAddressByIdAction("user-1");

    expect(mockErrorLogger).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error fetching address by ID:",
      error,
    );
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
