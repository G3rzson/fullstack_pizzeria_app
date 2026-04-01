"use server";

import { revalidatePath } from "next/cache";
import { hasPermission } from "@/shared/Functions/hasPermission";
import { idValidator } from "@/shared/Functions/idValidator";
import { deletePastaDal } from "../_dal/pastaDal";

export async function deletePastaAction(pastaId: string) {
  try {
    const permissionResult = await hasPermission();

    if (!permissionResult) {
      return {
        success: false,
        message: "Nincs jogosultságod a pasta törléséhez!",
      };
    }

    const { success, data } = idValidator.safeParse({ id: pastaId });
    if (!success) {
      return {
        success: false,
        message: "Érvénytelen azonosító!",
      };
    }

    await deletePastaDal(data.id);

    revalidatePath("/pastas");
    revalidatePath("/dashboard/pastas");
    return {
      success: true,
      message: "A pasta sikeresen törölve.",
    };
  } catch (error) {
    console.error("Error deleting pasta:", error);
    return {
      success: false,
      message: "Hiba történt a pasta törlése során.",
    };
  }
}
