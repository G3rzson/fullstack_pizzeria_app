"use server";

import { type AdminDrinkDtoType } from "@/shared/Types/types";
import { getAllDrinkDal } from "../_dal/drinkDal";
import { handleResponse } from "@/shared/Functions/handleResponse";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";
import { errorLogger } from "@/shared/Functions/errorLogger";
import isDev from "@/shared/Functions/isDev";

export async function getAllDrinkAction(): Promise<{
  success: boolean;
  message: string;
  data?: AdminDrinkDtoType[];
}> {
  try {
    const drinksArray = await getAllDrinkDal();

    const AdminDrinkDto: AdminDrinkDtoType[] = drinksArray.map((drink) => ({
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
    }));

    return handleResponse(
      true,
      BACKEND_RESPONSE_MESSAGES.SUCCESS,
      AdminDrinkDto,
    );
  } catch (error) {
    isDev()
      ? errorLogger(error, "server error - getAllAvailableDrinkAction")
      : console.error("Error fetching drinks:", error);
    return handleResponse(false, BACKEND_RESPONSE_MESSAGES.SERVER_ERROR);
  }
}
