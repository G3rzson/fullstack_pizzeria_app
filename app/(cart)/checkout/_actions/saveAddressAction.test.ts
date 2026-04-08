import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { saveAddressAction } from "./saveAddressAction";

vi.mock("../_dal/addressDal", () => ({ saveAddressDal: vi.fn() }));
vi.mock("@/shared/Functions/idValidator", () => ({
  idValidator: { safeParse: vi.fn() },
}));
vi.mock("../_validation/checkoutSchema", () => ({
  checkoutSchema: { safeParseAsync: vi.fn() },
}));

import { saveAddressDal } from "../_dal/addressDal";
import { idValidator } from "@/shared/Functions/idValidator";
import { checkoutSchema } from "../_validation/checkoutSchema";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";

describe("saveAddressAction", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns invalid id when user id is invalid", async () => {
    (idValidator.safeParse as Mock).mockReturnValue({ success: false });

    const result = await saveAddressAction("bad-id", {});

    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.INVALID_ID);
  });

  it("saves address and returns success", async () => {
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
        floor: "2/5",
        saveAddress: true,
      },
    });

    const result = await saveAddressAction("user-1", {});

    expect(result.success).toBe(true);
    expect(saveAddressDal).toHaveBeenCalledWith("user-1", {
      fullName: "Teszt Elek",
      phoneNumber: "+36301234567",
      postalCode: "1111",
      city: "Budapest",
      street: "Fo utca",
      houseNumber: "12",
      floorAndDoor: "2/5",
      isSaved: true,
    });
  });
});
