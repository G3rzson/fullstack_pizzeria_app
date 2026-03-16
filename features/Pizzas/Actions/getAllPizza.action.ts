"use server";

import { getAllPizzaDal } from "../Dal/pizza.dal";
import { BackendPizzaType } from "../Types/types";

type ResponseType =
  | {
      success: true;
      data: BackendPizzaType[];
    }
  | {
      success: false;
      message: string;
    };

export async function getAllPizzaAction(): Promise<ResponseType> {
  try {
    const pizzasArray = await getAllPizzaDal();
    return {
      success: true,
      data: pizzasArray,
    };
  } catch (error) {
    console.error("Error fetching pizzas:", error);
    return {
      success: false,
      message: "Hiba történt a pizzák lekérése során.",
    };
  }
}
