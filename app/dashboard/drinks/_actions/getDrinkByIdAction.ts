"use server";

import { getDrinkByIdDal } from "../_dal/drinkDal";
import { idValidator } from "@/shared/Functions/idValidator";
import { handleResponse } from "@/shared/Functions/handleResponse";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";
import { type AdminDrinkDtoType } from "@/shared/Types/types";
import { errorLogger } from "@/shared/Functions/errorLogger";
import isDev from "@/shared/Functions/isDev";
import { hasPermission } from "@/shared/Functions/hasPermission";

export async function getDrinkByIdAction(drinkId: string): Promise<{
  success: boolean;
  message: string;
  data?: AdminDrinkDtoType;
}> {
  try {
    const permissionResult = await hasPermission();

    if (!permissionResult)
      return handleResponse(false, BACKEND_RESPONSE_MESSAGES.UNAUTHORIZED);

    const { success, data } = idValidator.safeParse({ id: drinkId });
    if (!success)
      return handleResponse(false, BACKEND_RESPONSE_MESSAGES.INVALID_ID);

    const drink = await getDrinkByIdDal(data.id);

    if (!drink)
      return handleResponse(false, BACKEND_RESPONSE_MESSAGES.NOT_FOUND);

    const AdminDrinkDto: AdminDrinkDtoType = {
      id: drink.id,
      drinkName: drink.drinkName,
      drinkPrice: drink.drinkPrice,
      isAvailableOnMenu: drink.isAvailableOnMenu,
      image: drink.image
        ? {
            id: drink.image.id,
            drinkId: drink.image.drinkId,
            publicId: drink.image.publicId,
            publicUrl: drink.image.publicUrl,
            originalName: drink.image.originalName,
          }
        : null,
    };

    return handleResponse(
      true,
      BACKEND_RESPONSE_MESSAGES.SUCCESS,
      AdminDrinkDto,
    );
  } catch (error) {
    isDev()
      ? errorLogger(error, "server error - getDrinkByIdAction")
      : console.error("Error fetching drink by ID:", error);
    return handleResponse(false, BACKEND_RESPONSE_MESSAGES.SERVER_ERROR);
  }
}
