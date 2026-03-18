"use server";

import { getAllAvailablePizzaDal, PizzaWithImageType } from "../Dal/pizza.dal";

type ResponseType =
  | {
      success: true;
      data: PizzaWithImageType[];
    }
  | {
      success: false;
      message: string;
    };

export async function getAllAvailablePizzaAction(): Promise<ResponseType> {
  try {
    const pizzasArray = await getAllAvailablePizzaDal();
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
