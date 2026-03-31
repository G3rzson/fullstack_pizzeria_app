"use server";

import { hasPermission } from "@/shared/Functions/hasPermission";
import { updateImageDal } from "../_dal/pizzaDal";
import { pizzaImageSchema } from "../_validation/pizzaImageSchema";
import { deleteCloudinaryImage } from "./deleteCloudinaryImage";
import { uploadImageToCloudinary } from "./uploadImageToCloudinary";
import { idValidator } from "@/shared/Functions/idValidator";

export async function updateImageAction(
  pizzaId: string,
  pizzaImage: unknown,
  publicId: string,
) {
  const permissionResult = await hasPermission();

  if (!permissionResult) {
    return {
      success: false,
      message: "Nincs jogosultságod a pizza frissítéséhez!",
    };
  }

  const { success: successId, data: idData } = idValidator.safeParse({
    id: pizzaId,
  });
  if (!successId) {
    return {
      success: false,
      message: "Érvénytelen azonosító!",
    };
  }

  const { data, success } = await pizzaImageSchema.safeParseAsync({
    pizzaImage,
  });
  const oldPublicId = publicId; // Store the old publicId for potential cleanup
  let newPublicId: string | null = null;

  if (!success || !data.pizzaImage) {
    return {
      success: false,
      message: "Érvénytelen kép fájl!",
    };
  }
  try {
    const result = await uploadImageToCloudinary(data.pizzaImage);

    newPublicId = result.public_id; // Store the new publicId for potential cleanup

    const updatedImageData = {
      publicId: result.public_id,
      publicUrl: result.secure_url,
      originalName: data.pizzaImage.name,
    };

    await updateImageDal(idData.id, updatedImageData);

    await deleteCloudinaryImage(oldPublicId);

    return {
      success: true,
      message: "Pizza kép sikeresen frissítve!",
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
