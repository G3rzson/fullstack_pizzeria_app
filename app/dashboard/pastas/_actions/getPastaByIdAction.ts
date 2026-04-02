import { idValidator } from "@/shared/Functions/idValidator";
import { getPastaByIdDal } from "../_dal/pastaDal";
import { hasPermission } from "@/shared/Functions/hasPermission";
import { type ActionResponseType, type PastaType } from "@/shared/Types/types";

export async function getPastaByIdAction(
  id: string,
): Promise<ActionResponseType<PastaType>> {
  try {
    const permissionResult = await hasPermission();

    if (!permissionResult) {
      return {
        success: false,
        message: "Nincs jogosultságod ehhez a művelethez!",
      };
    }

    const { success, data } = idValidator.safeParse({ id });
    if (!success) {
      return {
        success: false,
        message: "Érvénytelen azonosító!",
      };
    }

    const pasta = await getPastaByIdDal(data.id);

    if (!pasta) {
      return { success: false, message: "Menü nem található!" };
    }

    const formattedPasta: PastaType = {
      id: pasta.id,
      pastaName: pasta.pastaName,
      pastaDescription: pasta.pastaDescription,
      pastaPrice: pasta.pastaPrice,
      isAvailableOnMenu: pasta.isAvailableOnMenu,
      image: pasta.image
        ? {
            id: pasta.image.id,
            pastaId: pasta.image.pastaId,
            publicId: pasta.image.publicId,
            publicUrl: pasta.image.publicUrl,
            originalName: pasta.image.originalName,
          }
        : null,
      createdAt: pasta.createdAt.toISOString(),
      updatedAt: pasta.updatedAt.toISOString(),
    };

    return {
      success: true,
      message: "Sikeres lekérés!",
      data: formattedPasta,
    };
  } catch (error) {
    console.error("Error fetching pasta by ID:", error);
    return {
      success: false,
      message: "Hiba történt a lekérés során!",
    };
  }
}
