"use server";

import { revalidatePath } from "next/cache";
import { deletePizzaDal } from "../Dal/pizzaDal";

export async function deletePizzaAction(pizzaId: string) {
  try {
    await deletePizzaDal(pizzaId);

    revalidatePath("/pizzas");
    revalidatePath("/admin/pizzas");
    return {
      success: true,
      message: "A pizza sikeresen törölve.",
    };
  } catch (error) {
    console.error("Error deleting pizza:", error);
    return {
      success: false,
      message: "Hiba történt a pizza törlése során.",
    };
  }
}
