"use server";

import { updateImageDal } from "../Dal/pizzaDal";
import { pizzaImageSchema } from "../Validation/pizzaImageSchema";
import { deleteCloudinaryImage } from "./Cloudinary/deleteCloudinaryImage";
import { uploadImageToCloudinary } from "./Cloudinary/uploadImageToCloudinary";

export async function updateImageAction(
  pizzaId: string,
  pizzaImage: unknown,
  publicId: string,
) {
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

    await updateImageDal(pizzaId, updatedImageData);

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
