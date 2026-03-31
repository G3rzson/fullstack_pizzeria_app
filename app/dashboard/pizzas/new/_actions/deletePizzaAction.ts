"use server";

import { revalidatePath } from "next/cache";
import { deletePizzaDal } from "../_dal/pizzaDal";
import { hasPermission } from "@/shared/Functions/hasPermission";
import { idValidator } from "@/shared/Functions/idValidator";

export async function deletePizzaAction(pizzaId: string) {
  try {
    const permissionResult = await hasPermission();

    if (!permissionResult) {
      return {
        success: false,
        message: "Nincs jogosultságod a pizza törléséhez!",
      };
    }

    const { success, data } = idValidator.safeParse({ id: pizzaId });
    if (!success) {
      return {
        success: false,
        message: "Érvénytelen azonosító!",
      };
    }

    await deletePizzaDal(data.id);

    revalidatePath("/pizzas");
    revalidatePath("/dashboard/pizzas");
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
