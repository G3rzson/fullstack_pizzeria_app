"use server";

import { hasPermission } from "@/shared/Functions/hasPermission";
import { idValidator } from "@/shared/Functions/idValidator";
import { imageSchema } from "@/shared/Validation/ImageSchema";
import { uploadImageToCloudinary } from "@/shared/Functions/uploadImageToCloudinary";
import { deleteCloudinaryImage } from "@/shared/Functions/deleteCloudinaryImage";
import { uploadPastaImageDal } from "../_dal/pastaDal";
import { SimpleResponseType } from "@/shared/Types/types";

export async function uploadPastaImageAction(
  id: string,
  pastaImage: unknown,
): Promise<SimpleResponseType> {
  let publicId: string | null = null;
  try {
    const permissionResult = await hasPermission();

    if (!permissionResult) {
      return {
        success: false,
        message: "Nincs jogosultságod a művelethez!",
      };
    }

    const { success: successId, data: idData } = idValidator.safeParse({ id });
    if (!successId) {
      return {
        success: false,
        message: "Érvénytelen azonosító!",
      };
    }

    const { data, success } = await imageSchema.safeParseAsync({
      image: pastaImage,
    });

    if (!success || !data.image) {
      return {
        success: false,
        message: "Érvénytelen kép fájl!",
      };
    }

    const result = await uploadImageToCloudinary(data.image, "pastas");

    const imageData = {
      publicId: result.public_id,
      publicUrl: result.secure_url,
      originalName: data.image.name,
    };

    await uploadPastaImageDal(idData.id, imageData);

    publicId = result.public_id; // Store the publicId for potential cleanup
    return {
      success: true,
      message: "Pasta kép sikeresen feltöltve!",
    };
  } catch (error) {
    if (publicId) {
      await deleteCloudinaryImage(publicId);
    }
    console.error("Error uploading image:", error);
    return {
      success: false,
      message: "Hiba történt a kép feltöltése során.",
    };
  }
}
