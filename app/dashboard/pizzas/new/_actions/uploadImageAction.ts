"use server";

import { hasPermission } from "@/shared/Functions/hasPermission";
import { pizzaImageSchema } from "../_validation/pizzaImageSchema";
import { idValidator } from "@/shared/Functions/idValidator";
import { uploadImageToCloudinary } from "./uploadImageToCloudinary";
import { uploadImageDal } from "../_dal/pizzaDal";
import { deleteCloudinaryImage } from "./deleteCloudinaryImage";

export async function uploadImageAction(id: string, pizzaImage: unknown) {
  const permissionResult = await hasPermission();

  if (!permissionResult) {
    return {
      success: false,
      message: "Nincs jogosultságod a pizza frissítéséhez!",
    };
  }

  const { success: successId, data: idData } = idValidator.safeParse({ id });
  if (!successId) {
    return {
      success: false,
      message: "Érvénytelen azonosító!",
    };
  }

  const { data, success } = await pizzaImageSchema.safeParseAsync({
    pizzaImage,
  });
  let publicId: string | null = null;

  if (!success || !data.pizzaImage) {
    return {
      success: false,
      message: "Érvénytelen kép fájl!",
    };
  }

  try {
    const result = await uploadImageToCloudinary(data.pizzaImage);

    const imageData = {
      publicId: result.public_id,
      publicUrl: result.secure_url,
      originalName: data.pizzaImage.name,
    };

    await uploadImageDal(idData.id, imageData);

    publicId = result.public_id; // Store the publicId for potential cleanup
    return {
      success: true,
      message: "Pizza kép sikeresen feltöltve!",
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
