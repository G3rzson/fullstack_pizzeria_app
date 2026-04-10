"use server";

import { DrinkDtoType } from "@/shared/Types/types";
import { getAllAvailableDrinkDal } from "../_dal/drinkDal";
import isDev from "@/shared/Functions/isDev";
import { errorLogger } from "@/shared/Functions/errorLogger";
import { handleResponse } from "@/shared/Functions/handleResponse";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";

export async function getAllAvailableDrinkAction(): Promise<{
  success: boolean;
  message: string;
  data?: DrinkDtoType[];
}> {
  try {
    const drinksArray = await getAllAvailableDrinkDal();

    const drinkDto: DrinkDtoType[] = drinksArray.map((drink) => ({
      id: drink.id,
      drinkName: drink.drinkName,
      drinkPrice: drink.drinkPrice,
      isAvailableOnMenu: drink.isAvailableOnMenu,
      image: drink.image ? { publicUrl: drink.image.publicUrl } : null,
    }));

    return handleResponse(true, BACKEND_RESPONSE_MESSAGES.SUCCESS, drinkDto);
  } catch (error) {
    isDev()
      ? errorLogger(error, "server error - getAllAvailableDrinkAction")
      : console.error("Error fetching drinks:", error);
    return handleResponse(false, BACKEND_RESPONSE_MESSAGES.SERVER_ERROR);
  }
}
