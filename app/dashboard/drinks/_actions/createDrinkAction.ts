"use server";

import { revalidatePath } from "next/cache";
import { hasPermission } from "@/shared/Functions/hasPermission";
import { drinkSchema } from "../_validation/drinkSchema";
import { createDrinkDal } from "../_dal/drinkDal";
import { handleResponse } from "@/shared/Functions/handleResponse";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";
import { errorLogger } from "@/shared/Functions/errorLogger";
import isDev from "@/shared/Functions/isDev";

export async function createDrinkAction(drink: unknown) {
  try {
    const permissionResult = await hasPermission();

    if (!permissionResult)
      return handleResponse(false, BACKEND_RESPONSE_MESSAGES.UNAUTHORIZED);

    const { data, success } = await drinkSchema.safeParseAsync(drink);

    if (!success)
      return handleResponse(false, BACKEND_RESPONSE_MESSAGES.INVALID_DATA);

    const newDrink = {
      ...data,
      category: "italok",
      createdBy: permissionResult.username,
    };

    await createDrinkDal(newDrink);

    revalidatePath(`/drinks`);
    revalidatePath(`/dashboard/drinks`);
    return handleResponse(true, BACKEND_RESPONSE_MESSAGES.SUCCESS);
  } catch (error) {
    isDev()
      ? errorLogger(error, "server error - createDrinkAction")
      : console.error("Error creating drink:", error);
    return handleResponse(false, BACKEND_RESPONSE_MESSAGES.SERVER_ERROR);
  }
}
