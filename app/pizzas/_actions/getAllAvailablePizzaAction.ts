"use server";

import { getAllAvailablePizzaDal } from "../_dal/pizzaDal";

export type FormattedPizzaType = {
  id: string;
  pizzaName: string;
  pizzaPrice32: number;
  pizzaPrice45: number;
  pizzaDescription: string;
  publicUrl: string | null;
};

type ResponseType =
  | {
      success: true;
      data: FormattedPizzaType[];
    }
  | {
      success: false;
      message: string;
    };

export async function getAllAvailablePizzaAction(): Promise<ResponseType> {
  try {
    const pizzasArray = await getAllAvailablePizzaDal();

    const formattedPizzas: FormattedPizzaType[] = pizzasArray.map((pizza) => ({
      id: pizza.id,
      pizzaName: pizza.pizzaName,
      pizzaPrice32: pizza.pizzaPrice32,
      pizzaPrice45: pizza.pizzaPrice45,
      pizzaDescription: pizza.pizzaDescription,
      publicUrl: pizza.image?.publicUrl || null,
    }));

    return {
      success: true,
      data: formattedPizzas,
    };
  } catch (error) {
    console.error("Error fetching pizzas:", error);
    return {
      success: false,
      message: "Hiba történt a pizzák lekérése során.",
    };
  }
}
