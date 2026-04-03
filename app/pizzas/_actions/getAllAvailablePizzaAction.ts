"use server";

import { pizzaDtoType } from "@/shared/Types/types";
import { getAllAvailablePizzaDal } from "../_dal/pizzaDal";
import { handleResponse } from "@/shared/Functions/handleResponse";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";
import { errorLogger } from "@/shared/Functions/errorLogger";
import isDev from "@/shared/Functions/isDev";

export async function getAllAvailablePizzaAction(): Promise<{
  success: boolean;
  message: string;
  data?: pizzaDtoType[];
}> {
  try {
    const pizzasArray = await getAllAvailablePizzaDal();

    const pizzaDto: pizzaDtoType[] = pizzasArray.map((pizza) => ({
      id: pizza.id,
      pizzaName: pizza.pizzaName,
      pizzaPrice32: pizza.pizzaPrice32,
      pizzaPrice45: pizza.pizzaPrice45,
      pizzaDescription: pizza.pizzaDescription,
      publicUrl: pizza.image?.publicUrl || null,
    }));

    return handleResponse(true, BACKEND_RESPONSE_MESSAGES.SUCCESS, pizzaDto);
  } catch (error) {
    isDev()
      ? errorLogger(error, "server error - getAllAvailablePizzaAction")
      : console.error("Error fetching pizzas:", error);
    return handleResponse(false, BACKEND_RESPONSE_MESSAGES.SERVER_ERROR);
  }
}
