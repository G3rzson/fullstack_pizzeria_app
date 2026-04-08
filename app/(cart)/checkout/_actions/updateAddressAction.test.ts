import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { updateAddressAction } from "./updateAddressAction";

vi.mock("../_dal/addressDal", () => ({ updateAddressDal: vi.fn() }));
vi.mock("@/shared/Functions/idValidator", () => ({
  idValidator: { safeParse: vi.fn() },
}));
vi.mock("../_validation/checkoutSchema", () => ({
  checkoutSchema: { safeParseAsync: vi.fn() },
}));

import { updateAddressDal } from "../_dal/addressDal";
import { idValidator } from "@/shared/Functions/idValidator";
import { checkoutSchema } from "../_validation/checkoutSchema";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";

describe("updateAddressAction", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns invalid data when checkout schema fails", async () => {
    (idValidator.safeParse as Mock).mockReturnValue({
      success: true,
      data: { id: "user-1" },
    });
    (checkoutSchema.safeParseAsync as Mock).mockResolvedValue({
      success: false,
    });

    const result = await updateAddressAction("user-1", {});

    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.INVALID_DATA);
  });

  it("updates address and returns success", async () => {
    (idValidator.safeParse as Mock).mockReturnValue({
      success: true,
      data: { id: "user-1" },
    });
    (checkoutSchema.safeParseAsync as Mock).mockResolvedValue({
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

    expect(result.success).toBe(true);
    expect(updateAddressDal).toHaveBeenCalledWith("user-1", {
      fullName: "Teszt Elek",
      phoneNumber: "+36301234567",
      postalCode: "1111",
      city: "Budapest",
      street: "Fo utca",
      houseNumber: "12",
      floorAndDoor: null,
      isSaved: false,
    });
  });
});
