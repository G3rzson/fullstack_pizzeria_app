"use server";

import { revalidatePath } from "next/cache";
import { hasPermission } from "@/shared/Functions/hasPermission";
import { idValidator } from "@/shared/Functions/idValidator";
import { drinkSchema } from "../_validation/drinkSchema";
import { updateDrinkDal } from "../_dal/drinkDal";

export async function updateDrinkAction(drinkId: string, drink: unknown) {
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
      message: "Nincs jogosultságod az ital frissítéséhez!",
    };
  }

  const { success: successId, data: idData } = idValidator.safeParse({
    id: drinkId,
  });
  if (!successId) {
    return {
      success: false,
      message: "Érvénytelen azonosító!",
    };
  }

  try {
    const newDrink = {
      ...data,
      category: "italok",
      createdBy: permissionResult.username,
    };

    await updateDrinkDal(idData.id, newDrink);

    revalidatePath(`/drinks`);
    revalidatePath(`/dashboard/drinks`);
    return { success: true, message: "Ital sikeresen frissítve!" };
  } catch (error) {
    console.error("Error updating drink:", error);
    return {
      success: false,
      message: "Hiba történt az ital frissítése során.",
    };
  }
}
