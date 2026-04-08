"use server";

import { revalidatePath } from "next/cache";
import { idValidator } from "@/shared/Functions/idValidator";
import { drinkSchema } from "../_validation/drinkSchema";
import { updateDrinkDal } from "../_dal/drinkDal";
import { handleResponse } from "@/shared/Functions/handleResponse";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";
import { errorLogger } from "@/shared/Functions/errorLogger";
import isDev from "@/shared/Functions/isDev";
import { hasPermission } from "@/shared/Functions/hasPermission";

export async function updateDrinkAction(drinkId: string, drink: unknown) {
  try {
    const permissionResult = await hasPermission();

    if (!permissionResult)
      return handleResponse(false, BACKEND_RESPONSE_MESSAGES.UNAUTHORIZED);

    const { success: successId, data: idData } = idValidator.safeParse({
      id: drinkId,
    });
    if (!successId)
      return handleResponse(false, BACKEND_RESPONSE_MESSAGES.INVALID_ID);

    const { data, success } = await drinkSchema.safeParseAsync(drink);

    if (!success)
      return handleResponse(false, BACKEND_RESPONSE_MESSAGES.INVALID_DATA);

    const newDrink = {
      ...data,
      category: "italok",
      createdBy: permissionResult.username,
    };

    await updateDrinkDal(idData.id, newDrink);

    revalidatePath(`/drinks`);
    revalidatePath(`/dashboard/drinks`);
    return handleResponse(true, BACKEND_RESPONSE_MESSAGES.SUCCESS);
  } catch (error) {
    isDev()
      ? errorLogger(error, "server error - updateDrinkAction")
      : console.error("Error updating drink:", error);
    return handleResponse(false, BACKEND_RESPONSE_MESSAGES.SERVER_ERROR);
  }
}
