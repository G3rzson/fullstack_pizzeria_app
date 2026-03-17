"use server";

import { uploadImageDal } from "../Dal/pizzaDal";
import { pizzaImageSchema } from "../Validation/pizzaImageSchema";
import { deleteCloudinaryImage } from "./Cloudinary/deleteCloudinaryImage";
import { uploadImageToCloudinary } from "./Cloudinary/uploadImageToCloudinary";

export async function uploadImageAction(id: string, pizzaImage: unknown) {
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

    await uploadImageDal(id, imageData);

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
