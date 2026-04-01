"use server";

import { hasPermission } from "@/shared/Functions/hasPermission";
import { idValidator } from "@/shared/Functions/idValidator";
import { imageSchema } from "@/shared/Validation/ImageSchema";
import { uploadImageToCloudinary } from "@/shared/Functions/uploadImageToCloudinary";
import { uploadPizzaImageDal } from "@/app/dashboard/pizzas/_dal/pizzaDal";
import { deleteCloudinaryImage } from "@/shared/Functions/deleteCloudinaryImage";
import { uploadPastaImageDal } from "../_dal/pastaDal";

export async function uploadPastaImageAction(id: string, pastaImage: unknown) {
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
      pastaImage,
    });

    if (!success || !data.pastaImage) {
      return {
        success: false,
        message: "Érvénytelen kép fájl!",
      };
    }

    const result = await uploadImageToCloudinary(data.pastaImage, "pastas");

    const imageData = {
      publicId: result.public_id,
      publicUrl: result.secure_url,
      originalName: data.pastaImage.name,
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
