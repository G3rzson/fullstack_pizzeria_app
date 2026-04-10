"use server";

import { getPizzaByIdDal } from "../_dal/pizzaDal";
import { idValidator } from "@/shared/Functions/idValidator";
import { AdminPizzaDtoType } from "@/shared/Types/types";
import { handleResponse } from "@/shared/Functions/handleResponse";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";
import isDev from "@/shared/Functions/isDev";
import { errorLogger } from "@/shared/Functions/errorLogger";
import { hasPermission } from "@/shared/Functions/hasPermission";

export async function getPizzaByIdAction(id: string): Promise<{
  success: boolean;
  message: string;
  data?: AdminPizzaDtoType;
}> {
  try {
    const permissionResult = await hasPermission();

    if (!permissionResult)
      return handleResponse(false, BACKEND_RESPONSE_MESSAGES.UNAUTHORIZED);

    const { success, data } = idValidator.safeParse({ id });
    if (!success)
      return handleResponse(false, BACKEND_RESPONSE_MESSAGES.INVALID_ID);

    const pizza = await getPizzaByIdDal(data.id);

    if (!pizza)
      return handleResponse(false, BACKEND_RESPONSE_MESSAGES.NOT_FOUND);

    const AdminPizzaDto: AdminPizzaDtoType = {
      id: pizza.id,
      pizzaName: pizza.pizzaName,
      pizzaDescription: pizza.pizzaDescription,
      pizzaPrice32: pizza.pizzaPrice32,
      pizzaPrice45: pizza.pizzaPrice45,
      isAvailableOnMenu: pizza.isAvailableOnMenu,
      image: pizza.image
        ? {
            id: pizza.image.id,
            pizzaId: pizza.image.pizzaId,
            publicId: pizza.image.publicId,
            publicUrl: pizza.image.publicUrl,
            originalName: pizza.image.originalName,
          }
        : null,
    };

    return handleResponse(
      true,
      BACKEND_RESPONSE_MESSAGES.SUCCESS,
      AdminPizzaDto,
    );
  } catch (error) {
    isDev()
      ? errorLogger(error, "server error - getPizzaByIdAction")
      : console.error("Error fetching pizza by ID:", error);
    return handleResponse(false, BACKEND_RESPONSE_MESSAGES.SERVER_ERROR);
  }
}
