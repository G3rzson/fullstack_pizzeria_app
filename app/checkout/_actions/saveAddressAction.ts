"use server";

import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";
import { errorLogger } from "@/shared/Functions/errorLogger";
import { handleResponse } from "@/shared/Functions/handleResponse";
import isDev from "@/shared/Functions/isDev";
import { checkoutSchema } from "../_validation/checkoutSchema";
import { saveAddressDal } from "../_dal/addressDal";
import { idValidator } from "@/shared/Functions/idValidator";

export async function saveAddressAction(userId: string, data: unknown) {
  try {
    const validatedId = idValidator.safeParse({ id: userId });

    if (!validatedId.success) {
      return handleResponse(false, BACKEND_RESPONSE_MESSAGES.INVALID_ID);
    }

    const validatedData = await checkoutSchema.safeParseAsync(data);

    if (!validatedData.success)
      return handleResponse(false, BACKEND_RESPONSE_MESSAGES.INVALID_DATA);

    const addressData = {
      fullName: validatedData.data.fullName,
      phoneNumber: validatedData.data.phoneNumber,
      postalCode: validatedData.data.postalCode,
      city: validatedData.data.city,
      street: validatedData.data.street,
      houseNumber: validatedData.data.houseNumber,
      floorAndDoor: validatedData.data.floor || null,
      isSaved: validatedData.data.saveAddress,
    };

    await saveAddressDal(validatedId.data.id, addressData);
    return handleResponse(true, BACKEND_RESPONSE_MESSAGES.SUCCESS);
  } catch (error) {
    isDev()
      ? await errorLogger(error, "server error - saveAddressAction")
      : console.error("Error saving address:", error);
    return handleResponse(false, BACKEND_RESPONSE_MESSAGES.SERVER_ERROR);
  }
}
