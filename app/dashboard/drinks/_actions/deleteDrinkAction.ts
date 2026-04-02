"use server";

import { revalidatePath } from "next/cache";
import { hasPermission } from "@/shared/Functions/hasPermission";
import { idValidator } from "@/shared/Functions/idValidator";
import { deleteDrinkDal } from "../_dal/drinkDal";

export async function deleteDrinkAction(
  drinkId: string,
  publicId: string | null,
) {
  try {
    const permissionResult = await hasPermission();

    if (!permissionResult) {
      return {
        success: false,
        message: "Nincs jogosultságod az ital törléséhez!",
      };
    }

    const { success, data } = idValidator.safeParse({ id: drinkId });
    if (!success) {
      return {
        success: false,
        message: "Érvénytelen azonosító!",
      };
    }

    await deleteDrinkDal(data.id);

    if (publicId) {
      const { deleteCloudinaryImage } =
        await import("@/shared/Functions/deleteCloudinaryImage");
      await deleteCloudinaryImage(publicId);
    }

    revalidatePath("/drinks");
    revalidatePath("/dashboard/drinks");
    return {
      success: true,
      message: "Az ital sikeresen törölve.",
    };
  } catch (error) {
    console.error("Error deleting drink:", error);
    return {
      success: false,
      message: "Hiba történt az ital törlése során.",
    };
  }
}
