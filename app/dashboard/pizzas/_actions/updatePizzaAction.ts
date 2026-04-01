"use server";

import { hasPermission } from "@/shared/Functions/hasPermission";
import { updatePizzaDal } from "../_dal/pizzaDal";
import { pizzaSchema } from "../_validation/pizzaSchema";
import { idValidator } from "@/shared/Functions/idValidator";

export async function updatePizzaAction(pizzaId: string, pizza: unknown) {
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
      message: "Nincs jogosultságod a pizza frissítéséhez!",
    };
  }

  const { success: successId, data: idData } = idValidator.safeParse({
    id: pizzaId,
  });
  if (!successId) {
    return {
      success: false,
      message: "Érvénytelen azonosító!",
    };
  }

  try {
    const newPizza = {
      ...data,
      category: "pizzák",
      createdBy: permissionResult.username,
    };

    await updatePizzaDal(idData.id, newPizza);

    return { success: true, message: "Pizza sikeresen frissítve!" };
  } catch (error) {
    console.error("Error updating pizza:", error);
    return {
      success: false,
      message: "Hiba történt a pizza frissítése során.",
    };
  }
}
