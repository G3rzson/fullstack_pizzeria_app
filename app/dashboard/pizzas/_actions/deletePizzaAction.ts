"use server";

import { revalidatePath } from "next/cache";
import { deletePizzaDal } from "../_dal/pizzaDal";
import { hasPermission } from "@/shared/Functions/hasPermission";
import { idValidator } from "@/shared/Functions/idValidator";
import { handleResponse } from "@/shared/Functions/handleResponse";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";
import isDev from "@/shared/Functions/isDev";
import { errorLogger } from "@/shared/Functions/errorLogger";

export async function deletePizzaAction(
  pizzaId: string,
  publicId: string | null,
) {
  try {
    const permissionResult = await hasPermission();

    if (!permissionResult)
      return handleResponse(false, BACKEND_RESPONSE_MESSAGES.UNAUTHORIZED);

    const { success, data } = idValidator.safeParse({ id: pizzaId });
    if (!success)
      return handleResponse(false, BACKEND_RESPONSE_MESSAGES.INVALID_ID);

    await deletePizzaDal(data.id);

    if (publicId) {
      const { deleteCloudinaryImage } =
        await import("@/shared/Functions/deleteCloudinaryImage");
      await deleteCloudinaryImage(publicId);
    }

    revalidatePath(`/pizzas`);
    revalidatePath(`/dashboard/pizzas`);
    return handleResponse(true, BACKEND_RESPONSE_MESSAGES.SUCCESS);
  } catch (error) {
    isDev()
      ? errorLogger(error, "server error - deletePizzaAction")
      : console.error("Error deleting pizza:", error);
    return handleResponse(false, BACKEND_RESPONSE_MESSAGES.SERVER_ERROR);
  }
}
