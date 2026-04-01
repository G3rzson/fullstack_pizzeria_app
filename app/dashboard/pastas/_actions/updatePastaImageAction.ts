"use server";

import { hasPermission } from "@/shared/Functions/hasPermission";
import { deleteCloudinaryImage } from "@/shared/Functions/deleteCloudinaryImage";
import { uploadImageToCloudinary } from "@/shared/Functions/uploadImageToCloudinary";
import { idValidator } from "@/shared/Functions/idValidator";
import { imageSchema } from "@/shared/Validation/ImageSchema";
import { updatePizzaImageDal } from "@/app/dashboard/pizzas/_dal/pizzaDal";

export async function updatePastaImageAction(
  pastaId: string,
  pastaImage: unknown,
  publicId: string,
) {
  const permissionResult = await hasPermission();
  let newPublicId: string | null = null;

  try {
    if (!permissionResult) {
      return {
        success: false,
        message: "Nincs jogosultságod a művelethez!",
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

    const { data, success } = await imageSchema.safeParseAsync({
      pastaImage,
    });
    const oldPublicId = publicId; // Store the old publicId for potential cleanup

    if (!success || !data.pastaImage) {
      return {
        success: false,
        message: "Érvénytelen kép fájl!",
      };
    }

    const result = await uploadImageToCloudinary(data.pastaImage, "pastas");

    newPublicId = result.public_id; // Store the new publicId for potential cleanup

    const updatedImageData = {
      publicId: result.public_id,
      publicUrl: result.secure_url,
      originalName: data.pastaImage.name,
    };

    await updatePastaImageDal(idData.id, updatedImageData);

    await deleteCloudinaryImage(oldPublicId);

    return {
      success: true,
      message: "A kép sikeresen frissítve!",
    };
  } catch (error) {
    if (newPublicId) {
      await deleteCloudinaryImage(newPublicId);
    }
    console.error("Error updating image:", error);
    return {
      success: false,
      message: "Hiba történt a kép frissítése során.",
    };
  }
}
