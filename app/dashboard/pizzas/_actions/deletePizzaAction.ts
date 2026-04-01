"use server";

import { revalidatePath } from "next/cache";
import { deletePizzaDal } from "../_dal/pizzaDal";
import { hasPermission } from "@/shared/Functions/hasPermission";
import { idValidator } from "@/shared/Functions/idValidator";

export async function deletePizzaAction(id: string) {
  try {
    const permissionResult = await hasPermission();

    if (!permissionResult) {
      return {
        success: false,
        message: "Nincs jogosultságod a törléshez!",
      };
    }

    const { success, data } = idValidator.safeParse({ id });
    if (!success) {
      return {
        success: false,
        message: "Érvénytelen azonosító!",
      };
    }

    await deletePizzaDal(data.id);

    revalidatePath(`/pizzas`);
    revalidatePath(`/dashboard/pizzas`);
    return {
      success: true,
      message: "Sikeresen törölve.",
    };
  } catch (error) {
    console.error("Error deleting:", error);
    return {
      success: false,
      message: "Hiba történt a törlés során.",
    };
  }
}
