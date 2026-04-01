"use server";

import { hasPermission } from "@/shared/Functions/hasPermission";
import { idValidator } from "@/shared/Functions/idValidator";
import { imageSchema } from "@/shared/Validation/ImageSchema";
import { uploadImageToCloudinary } from "@/shared/Functions/uploadImageToCloudinary";
import { uploadPizzaImageDal } from "@/app/dashboard/pizzas/_dal/pizzaDal";
import { deleteCloudinaryImage } from "@/shared/Functions/deleteCloudinaryImage";

export async function uploadPizzaImageAction(id: string, pizzaImage: unknown) {
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
      pizzaImage,
    });

    if (!success || !data.pizzaImage) {
      return {
        success: false,
        message: "Érvénytelen kép fájl!",
      };
    }

    const result = await uploadImageToCloudinary(data.pizzaImage, "pizzas");

    const imageData = {
      publicId: result.public_id,
      publicUrl: result.secure_url,
      originalName: data.pizzaImage.name,
    };

    await uploadPizzaImageDal(idData.id, imageData);

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
