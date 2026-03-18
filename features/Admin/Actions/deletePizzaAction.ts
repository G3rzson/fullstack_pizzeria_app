"use server";

import { revalidatePath } from "next/cache";
import { deletePizzaDal } from "../Dal/pizzaDal";
import { requireAdmin } from "@/lib/requireAdmin";

export async function deletePizzaAction(pizzaId: string) {
  try {
    await requireAdmin();
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
