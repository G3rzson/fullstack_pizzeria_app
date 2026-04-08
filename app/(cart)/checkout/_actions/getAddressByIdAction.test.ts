import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { getAddressByIdAction } from "./getAddressByIdAction";

vi.mock("../_dal/addressDal", () => ({ getAddressByUserIdDal: vi.fn() }));
vi.mock("@/shared/Functions/idValidator", () => ({
  idValidator: { safeParse: vi.fn() },
}));

import { getAddressByUserIdDal } from "../_dal/addressDal";
import { idValidator } from "@/shared/Functions/idValidator";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";

describe("getAddressByIdAction", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns not found when address is missing", async () => {
    (idValidator.safeParse as Mock).mockReturnValue({
      success: true,
      data: { id: "user-1" },
    });
    (getAddressByUserIdDal as Mock).mockResolvedValue({ orderAddress: null });

    const result = await getAddressByIdAction("user-1");

    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.NOT_FOUND);
  });

  it("returns mapped address dto on success", async () => {
    (idValidator.safeParse as Mock).mockReturnValue({
      success: true,
      data: { id: "user-1" },
    });
    (getAddressByUserIdDal as Mock).mockResolvedValue({
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

    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      id: "addr-1",
      fullName: "Teszt Elek",
      phoneNumber: "+36301234567",
      postalCode: "1111",
      city: "Budapest",
      street: "Fo utca",
      houseNumber: "12",
      floorAndDoor: null,
      isSaved: true,
    });
  });
});
