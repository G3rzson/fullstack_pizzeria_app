"use server";
import { updateImageToCloudinary } from "@/features/Pizzas/Actions/Cloudinary/updateImageToCloudinary";
import { deleteCloudinaryImage } from "@/features/Pizzas/Actions/Cloudinary/deleteCloudinaryImage";
import { FrontendPizzaType } from "@/features/Pizzas/Types/types";
import { pizzaSchema } from "@/features/Pizzas/Validation/pizzaSchema";
import { updatePizzaDal } from "../Dal/pizza.dal";

export async function updatePizzaAction(pizzaId: string, data: unknown) {
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
      const uploadResult = await updateImageToCloudinary(
        pizzaImage,
        pizzaData.publicId,
      );

      savedPublicId = uploadResult.public_id;

      newPizza = {
        ...newPizza,
        publicId: uploadResult.public_id,
        originalName: pizzaImage.name,
        publicUrl: uploadResult.secure_url,
      };
    }

    await updatePizzaDal(pizzaId, newPizza);

    return { success: true, message: "Pizza sikeresen frissítve!" };
  } catch (error) {
    if (savedPublicId && savedPublicId !== validatedData.data.publicId) {
      await deleteCloudinaryImage(savedPublicId);
    }

    console.error("Error updating pizza:", error);
    return {
      success: false,
      message: "Hiba történt a pizza frissítése során.",
    };
  }
}
