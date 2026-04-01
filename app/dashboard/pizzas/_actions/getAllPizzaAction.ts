"use server";

import { getAllPizzaDal } from "../_dal/pizzaDal";

type FormattedPizzaType = {
  id: string;
  pizzaName: string;
  pizzaPrice32: number;
  pizzaPrice45: number;
  pizzaDescription: string;
  isAvailableOnMenu: boolean;
  pizzaId: string | null;
  publicId: string | null;
  originalName: string | null;
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

export async function getAllPizzaAction(): Promise<ResponseType> {
  try {
    const pizzasArray = await getAllPizzaDal();

    const formattedPizzas: FormattedPizzaType[] = pizzasArray.map((pizza) => ({
      id: pizza.id,
      pizzaName: pizza.pizzaName,
      pizzaPrice32: pizza.pizzaPrice32,
      pizzaPrice45: pizza.pizzaPrice45,
      pizzaDescription: pizza.pizzaDescription,
      isAvailableOnMenu: pizza.isAvailableOnMenu,
      pizzaId: pizza.image?.pizzaId || null,
      publicId: pizza.image?.publicId || null,
      originalName: pizza.image?.originalName || null,
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
