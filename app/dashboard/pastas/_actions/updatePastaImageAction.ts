"use server";

import { revalidatePath } from "next/cache";
import { hasPermission } from "@/shared/Functions/hasPermission";
import { deleteCloudinaryImage } from "@/shared/Functions/deleteCloudinaryImage";
import { uploadImageToCloudinary } from "@/shared/Functions/uploadImageToCloudinary";
import { idValidator } from "@/shared/Functions/idValidator";
import { imageSchema } from "@/shared/Validation/ImageSchema";
import { SimpleResponseType } from "@/shared/Types/types";
import { updatePastaImageDal } from "../_dal/pastaDal";

export async function updatePastaImageAction(
  pastaId: string,
  pastaImage: unknown,
  publicId: string,
): Promise<SimpleResponseType> {
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
      image: pastaImage,
    });
    const oldPublicId = publicId; // Store the old publicId for potential cleanup

    if (!success || !data.image) {
      return {
        success: false,
        message: "Érvénytelen kép fájl!",
      };
    }

    const result = await uploadImageToCloudinary(data.image, "pastas");

    newPublicId = result.public_id; // Store the new publicId for potential cleanup

    const updatedImageData = {
      publicId: result.public_id,
      publicUrl: result.secure_url,
      originalName: data.image.name,
    };

    await updatePastaImageDal(idData.id, updatedImageData);

    await deleteCloudinaryImage(oldPublicId);

    revalidatePath(`/pastas`);
    revalidatePath(`/dashboard/pastas`);
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
