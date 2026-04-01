"use server";

import { revalidatePath } from "next/cache";
import { hasPermission } from "@/shared/Functions/hasPermission";
import { idValidator } from "@/shared/Functions/idValidator";
import { changePizzaMenuDal } from "@/app/dashboard/pizzas/_dal/pizzaDal";

export async function changePizzaMenuAction(
  pastaId: string,
  isAvailableOnMenu: boolean,
) {
  try {
    const permissionResult = await hasPermission();

    if (!permissionResult) {
      return {
        success: false,
        message: "Nincs jogosultságod a menü státuszának megváltoztatásához!",
      };
    }

    const { success, data } = idValidator.safeParse({ id: pastaId });
    if (!success) {
      return {
        success: false,
        message: "Érvénytelen azonosító!",
      };
    }

    await changePizzaMenuDal(data.id, !isAvailableOnMenu);

    revalidatePath(`/pizzas`);
    revalidatePath(`/dashboard/pizzas`);
    return {
      success: true,
      message: "A menü státusza sikeresen megváltozott.",
    };
  } catch (error) {
    console.error("Error changing menu status:", error);
    return {
      success: false,
      message: "Hiba történt a menü státuszának megváltoztatása során.",
    };
  }
}
