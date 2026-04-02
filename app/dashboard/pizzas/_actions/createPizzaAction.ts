"use server";

import { createPizzaDal } from "../_dal/pizzaDal";
import { pizzaSchema } from "../_validation/pizzaSchema";
import { hasPermission } from "@/shared/Functions/hasPermission";

export async function createPizzaAction(pizza: unknown) {
  const { data, success } = await pizzaSchema.safeParseAsync(pizza);

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
      message: "Nincs jogosultságod új pizza létrehozásához!",
    };
  }

  try {
    const newPizza = {
      ...data,
      category: "pizzák",
      createdBy: permissionResult.username,
    };

    await createPizzaDal(newPizza);

    return { success: true, message: "Pizza sikeresen létrehozva!" };
  } catch (error) {
    console.error("Error creating pizza:", error);
    return {
      success: false,
      message: "Hiba történt a pizza létrehozása során.",
    };
  }
}
