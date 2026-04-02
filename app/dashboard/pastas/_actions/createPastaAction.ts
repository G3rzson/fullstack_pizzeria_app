"use server";

import { revalidatePath } from "next/cache";
import { pastaSchema } from "../_validation/pastaSchema";
import { hasPermission } from "@/shared/Functions/hasPermission";
import { createPastaDal } from "../_dal/pastaDal";

export async function createPastaAction(pasta: unknown) {
  const { data, success } = await pastaSchema.safeParseAsync(pasta);

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
      message: "Nincs jogosultságod új pasta létrehozásához!",
    };
  }

  try {
    const newPasta = {
      ...data,
      category: "pasták",
      createdBy: permissionResult.username,
    };

    await createPastaDal(newPasta);

    revalidatePath(`/pastas`);
    revalidatePath(`/dashboard/pastas`);
    return { success: true, message: "Pasta sikeresen létrehozva!" };
  } catch (error) {
    console.error("Error creating pasta:", error);
    return {
      success: false,
      message: "Hiba történt a pasta létrehozása során.",
    };
  }
}
