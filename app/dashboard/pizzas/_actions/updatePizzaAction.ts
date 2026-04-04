"use server";

import { revalidatePath } from "next/cache";
import { hasPermission } from "@/shared/Functions/hasPermission";
import { updatePizzaDal } from "../_dal/pizzaDal";
import { pizzaSchema } from "../_validation/pizzaSchema";
import { idValidator } from "@/shared/Functions/idValidator";
import { handleResponse } from "@/shared/Functions/handleResponse";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";
import isDev from "@/shared/Functions/isDev";
import { errorLogger } from "@/shared/Functions/errorLogger";

export async function updatePizzaAction(pizzaId: string, pizza: unknown) {
  try {
    const permissionResult = await hasPermission();

    if (!permissionResult)
      return handleResponse(false, BACKEND_RESPONSE_MESSAGES.UNAUTHORIZED);

    const { data, success } = await pizzaSchema.safeParseAsync(pizza);

    if (!success)
      return handleResponse(false, BACKEND_RESPONSE_MESSAGES.INVALID_DATA);

    const { success: successId, data: idData } = idValidator.safeParse({
      id: pizzaId,
    });

    if (!successId) {
      return handleResponse(false, BACKEND_RESPONSE_MESSAGES.INVALID_ID);
    }

    const newPizza = {
      ...data,
      category: "pizzák",
      createdBy: permissionResult.username,
    };

    await updatePizzaDal(idData.id, newPizza);

    revalidatePath(`/pizzas`);
    revalidatePath(`/dashboard/pizzas`);
    return handleResponse(true, BACKEND_RESPONSE_MESSAGES.SUCCESS);
  } catch (error) {
    isDev()
      ? errorLogger(error, "server error - updatePizzaAction")
      : console.error("Error updating pizza:", error);
    return handleResponse(false, BACKEND_RESPONSE_MESSAGES.SERVER_ERROR);
  }
}
