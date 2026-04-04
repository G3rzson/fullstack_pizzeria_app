"use server";

import { revalidatePath } from "next/cache";
import { hasPermission } from "@/shared/Functions/hasPermission";
import { idValidator } from "@/shared/Functions/idValidator";
import { changePizzaMenuDal } from "@/app/dashboard/pizzas/_dal/pizzaDal";
import { handleResponse } from "@/shared/Functions/handleResponse";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";
import { errorLogger } from "@/shared/Functions/errorLogger";
import isDev from "@/shared/Functions/isDev";

export async function changePizzaMenuAction(
  pizzaId: string,
  isAvailableOnMenu: boolean,
) {
  try {
    const permissionResult = await hasPermission();

    if (!permissionResult)
      return handleResponse(false, BACKEND_RESPONSE_MESSAGES.UNAUTHORIZED);

    const { success, data } = idValidator.safeParse({ id: pizzaId });

    if (!success)
      return handleResponse(false, BACKEND_RESPONSE_MESSAGES.INVALID_ID);

    await changePizzaMenuDal(data.id, !isAvailableOnMenu);

    revalidatePath(`/pizzas`);
    revalidatePath(`/dashboard/pizzas`);
    return handleResponse(true, BACKEND_RESPONSE_MESSAGES.SUCCESS);
  } catch (error) {
    isDev()
      ? errorLogger(error, "server error - changePizzaMenuAction")
      : console.error("Error changing menu status:", error);
    return handleResponse(false, BACKEND_RESPONSE_MESSAGES.SERVER_ERROR);
  }
}
