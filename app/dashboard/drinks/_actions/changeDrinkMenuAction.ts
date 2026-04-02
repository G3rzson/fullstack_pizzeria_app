"use server";

import { revalidatePath } from "next/cache";
import { hasPermission } from "@/shared/Functions/hasPermission";
import { idValidator } from "@/shared/Functions/idValidator";
import { changeDrinkMenuDal } from "../_dal/drinkDal";

export async function changeDrinkMenuAction(
  drinkId: string,
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

    const { success, data } = idValidator.safeParse({ id: drinkId });
    if (!success) {
      return {
        success: false,
        message: "Érvénytelen azonosító!",
      };
    }

    await changeDrinkMenuDal(data.id, !isAvailableOnMenu);

    revalidatePath("/drinks");
    revalidatePath("/dashboard/drinks");
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
