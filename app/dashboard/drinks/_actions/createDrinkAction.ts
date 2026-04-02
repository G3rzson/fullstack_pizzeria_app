"use server";

import { hasPermission } from "@/shared/Functions/hasPermission";
import { drinkSchema } from "../_validation/drinkSchema";
import { createDrinkDal } from "../_dal/drinkDal";

export async function createDrinkAction(drink: unknown) {
  const { data, success } = await drinkSchema.safeParseAsync(drink);

  if (!success) {
    return {
      success: false,
      message: "Érvénytelen adatok!",
    };
  }

  const permissionResult = await hasPermission();

  if (!permissionResult) {
    return {
      success: false,
      message: "Nincs jogosultságod új ital létrehozásához!",
    };
  }

  try {
    const newDrink = {
      ...data,
      category: "italok",
      createdBy: permissionResult.username,
    };

    await createDrinkDal(newDrink);

    return { success: true, message: "Ital sikeresen létrehozva!" };
  } catch (error) {
    console.error("Error creating drink:", error);
    return {
      success: false,
      message: "Hiba történt az ital létrehozása során.",
    };
  }
}
