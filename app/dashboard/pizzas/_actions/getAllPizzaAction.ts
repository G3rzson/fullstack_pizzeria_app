"use server";

import { handleResponse } from "@/shared/Functions/handleResponse";
import { getAllPizzaDal } from "../_dal/pizzaDal";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";
import isDev from "@/shared/Functions/isDev";
import { errorLogger } from "@/shared/Functions/errorLogger";
import { AdminPizzaDtoType } from "@/shared/Types/types";

export async function getAllPizzaAction(): Promise<{
  success: boolean;
  message: string;
  data?: AdminPizzaDtoType[];
}> {
  try {
    const pizzasArray = await getAllPizzaDal();

    const AdminPizzaDtoArray: AdminPizzaDtoType[] = pizzasArray.map(
      (pizza) => ({
        id: pizza.id,
        pizzaName: pizza.pizzaName,
        pizzaPrice32: pizza.pizzaPrice32,
        pizzaPrice45: pizza.pizzaPrice45,
        pizzaDescription: pizza.pizzaDescription,
        isAvailableOnMenu: pizza.isAvailableOnMenu,
        image: pizza.image
          ? {
              id: pizza.image.id,
              pizzaId: pizza.image.pizzaId,
              publicId: pizza.image.publicId,
              originalName: pizza.image.originalName,
              publicUrl: pizza.image.publicUrl,
            }
          : null,
      }),
    );

    return handleResponse(
      true,
      BACKEND_RESPONSE_MESSAGES.SUCCESS,
      AdminPizzaDtoArray,
    );
  } catch (error) {
    isDev()
      ? errorLogger(error, "server error - getAllPizzaAction")
      : console.error("Error fetching pizzas:", error);
    return handleResponse(false, BACKEND_RESPONSE_MESSAGES.SERVER_ERROR);
  }
}
