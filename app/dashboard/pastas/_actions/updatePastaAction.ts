"use server";

import { revalidatePath } from "next/cache";
import { hasPermission } from "@/shared/Functions/hasPermission";
import { idValidator } from "@/shared/Functions/idValidator";
import { pastaSchema } from "../_validation/pastaSchema";
import { updatePastaDal } from "../_dal/pastaDal";

export async function updatePastaAction(pastaId: string, pasta: unknown) {
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
      message: "Nincs jogosultságod a pasta frissítéséhez!",
    };
  }

  const { success: successId, data: idData } = idValidator.safeParse({
    id: pastaId,
  });
  if (!successId) {
    return {
      success: false,
      message: "Érvénytelen azonosító!",
    };
  }

  try {
    const newPasta = {
      ...data,
      category: "pasták",
      createdBy: permissionResult.username,
    };

    await updatePastaDal(idData.id, newPasta);

    revalidatePath(`/pastas`);
    revalidatePath(`/dashboard/pastas`);
    return { success: true, message: "Pasta sikeresen frissítve!" };
  } catch (error) {
    console.error("Error updating pasta:", error);
    return {
      success: false,
      message: "Hiba történt a pasta frissítése során.",
    };
  }
}
