"use server";

import { pizzaSchema } from "@/features/Admin/Validation/pizzaSchema";
import { updatePizzaDal } from "../Dal/pizzaDal";
import { requireAdmin } from "@/lib/requireAdmin";

export async function updatePizzaAction(pizzaId: string, pizza: unknown) {
  await requireAdmin();
  const { data, success } = await pizzaSchema.safeParseAsync(pizza);

  if (!success) {
    return {
      success: false,
      message: "Érvénytelen adatok!",
    };
  }
  try {
    const newPizza = {
      ...data,
      category: "pizzák",
      createdBy: "admin",
    };

    await updatePizzaDal(pizzaId, newPizza);

    return { success: true, message: "Pizza sikeresen frissítve!" };
  } catch (error) {
    console.error("Error updating pizza:", error);
    return {
      success: false,
      message: "Hiba történt a pizza frissítése során.",
    };
  }
}
