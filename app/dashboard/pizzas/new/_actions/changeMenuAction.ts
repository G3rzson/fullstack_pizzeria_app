"use server";

import { revalidatePath } from "next/cache";
import { changeMenuDal } from "../_dal/pizzaDal";
import { hasPermission } from "@/shared/Functions/hasPermission";
import { idValidator } from "@/shared/Functions/idValidator";

export async function changeMenuAction(
  pizzaId: string,
  isAvailableOnMenu: boolean,
) {
  try {
    const permissionResult = await hasPermission();

    if (!permissionResult) {
      return {
        success: false,
        message: "Nincs jogosultságod az étlap státuszának megváltoztatásához!",
      };
    }

    const { success, data } = idValidator.safeParse({ id: pizzaId });
    if (!success) {
      return {
        success: false,
        message: "Érvénytelen azonosító!",
      };
    }

    await changeMenuDal(data.id, !isAvailableOnMenu);

    revalidatePath("/pizzas");
    revalidatePath("/dashboard/pizzas");
    return {
      success: true,
      message: "Az étlap státusza sikeresen megváltozott.",
    };
  } catch (error) {
    console.error("Error changing menu status:", error);
    return {
      success: false,
      message: "Hiba történt az étlap státuszának megváltoztatása során.",
    };
  }
}
