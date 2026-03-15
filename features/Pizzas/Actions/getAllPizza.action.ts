"use server";

import { getAllPizzaDal, PizzaGetType } from "../Dal/pizza.dal";

type ResponseType =
  | {
      success: true;
      data: PizzaGetType[];
    }
  | {
      success: false;
      message: string;
    };

export async function getAllPizzaAction(): Promise<ResponseType> {
  //await new Promise((resolve) => setTimeout(resolve, 5000));
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
