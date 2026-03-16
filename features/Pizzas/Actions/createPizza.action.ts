"use server";

import { createPizzaDal } from "../Dal/pizza.dal";
import { pizzaSchema } from "../Validation/pizzaSchema";
import { uploadImageToCloudinary } from "./Cloudinary/uploadImageToCloudinary";
import { deleteCloudinaryImage } from "./Cloudinary/deleteCloudinaryImage";
import { FrontendPizzaType } from "../Types/types";

export async function createPizzaAction(data: unknown) {
  let savedPublicId: string | undefined = undefined;
  const validatedData = await pizzaSchema.safeParseAsync(data);

  if (!validatedData.success) {
    return {
      success: false,
      message: "Érvénytelen adatok!",
    };
  }

  try {
    const { pizzaImage, ...pizzaData } = validatedData.data;
    let newPizza: FrontendPizzaType = {
      ...pizzaData,
      createdBy: "admin",
    };

    if (pizzaImage) {
      const uploadResult = await uploadImageToCloudinary(pizzaImage);

      savedPublicId = uploadResult.public_id;

      newPizza = {
        ...newPizza,
        publicId: uploadResult.public_id,
        originalName: pizzaImage.name,
        publicUrl: uploadResult.secure_url,
      };
    }

    await createPizzaDal(newPizza);

    return { success: true, message: "Pizza sikeresen létrehozva!" };
  } catch (error) {
    if (savedPublicId) await deleteCloudinaryImage(savedPublicId);

    console.error("Error creating pizza:", error);
    return {
      success: false,
      message: "Hiba történt a pizza létrehozása során.",
    };
  }
}
