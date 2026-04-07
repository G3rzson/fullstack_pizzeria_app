import { handleResponse } from "@/shared/Functions/handleResponse";
import { getAddressByUserIdDal } from "../_dal/addressDal";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";
import { errorLogger } from "@/shared/Functions/errorLogger";
import isDev from "@/shared/Functions/isDev";
import { idValidator } from "@/shared/Functions/idValidator";
import { type AddressDtoType } from "@/shared/Types/types";

export async function getAddressByIdAction(userId: string): Promise<{
  success: boolean;
  message: string;
  data?: AddressDtoType;
}> {
  try {
    const validatedId = idValidator.safeParse({ id: userId });
    if (!validatedId.success)
      return handleResponse(false, BACKEND_RESPONSE_MESSAGES.INVALID_ID);

    const address = await getAddressByUserIdDal(validatedId.data.id);
    if (!address || !address.orderAddress)
      return handleResponse(false, BACKEND_RESPONSE_MESSAGES.NOT_FOUND);

    const addressDto: AddressDtoType = {
      id: address.orderAddress.id,
      fullName: address.orderAddress.fullName,
      phoneNumber: address.orderAddress.phoneNumber,
      postalCode: address.orderAddress.postalCode,
      city: address.orderAddress.city,
      street: address.orderAddress.street,
      houseNumber: address.orderAddress.houseNumber,
      floorAndDoor: address.orderAddress.floorAndDoor,
      isSaved: address.orderAddress.isSaved,
    };

    return handleResponse(true, BACKEND_RESPONSE_MESSAGES.SUCCESS, addressDto);
  } catch (error) {
    isDev()
      ? await errorLogger(error, "server error - getAddressByIdAction")
      : console.error("Error fetching address by ID:", error);
    return handleResponse(false, BACKEND_RESPONSE_MESSAGES.SERVER_ERROR);
  }
}
