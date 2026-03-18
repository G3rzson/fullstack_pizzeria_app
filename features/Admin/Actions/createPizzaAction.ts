"use server";

import { pizzaSchema } from "../Validation/pizzaSchema";
import { createPizzaDal } from "../Dal/pizzaDal";
import { requireAdmin } from "@/lib/requireAdmin";

export async function createPizzaAction(pizza: unknown) {
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

    console.log("Creating pizza with data:", newPizza);

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
