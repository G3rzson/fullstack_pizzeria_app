"use server";

import { revalidatePath } from "next/cache";
import { hasPermission } from "@/shared/Functions/hasPermission";
import { deleteCloudinaryImage } from "@/shared/Functions/deleteCloudinaryImage";
import { uploadImageToCloudinary } from "@/shared/Functions/uploadImageToCloudinary";
import { idValidator } from "@/shared/Functions/idValidator";
import { imageSchema } from "@/shared/Validation/ImageSchema";
import { updatePizzaImageDal } from "@/app/dashboard/pizzas/_dal/pizzaDal";
import { handleResponse } from "@/shared/Functions/handleResponse";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";
import isDev from "@/shared/Functions/isDev";
import { errorLogger } from "@/shared/Functions/errorLogger";

export async function updatePizzaImageAction(
  pizzaId: string,
  pizzaImage: unknown,
  publicId: string,
) {
  let newPublicId: string | null = null;

  try {
    const permissionResult = await hasPermission();
    if (!permissionResult)
      return handleResponse(false, BACKEND_RESPONSE_MESSAGES.UNAUTHORIZED);

    const { success: successId, data: idData } = idValidator.safeParse({
      id: pizzaId,
    });
    if (!successId)
      return handleResponse(false, BACKEND_RESPONSE_MESSAGES.INVALID_ID);

    const { data, success } = await imageSchema.safeParseAsync({
      image: pizzaImage,
    });
    const oldPublicId = publicId; // Store the old publicId for potential cleanup

    if (!success || !data.image)
      return handleResponse(false, BACKEND_RESPONSE_MESSAGES.INVALID_DATA);

    const result = await uploadImageToCloudinary(data.image, "pizzas");

    newPublicId = result.public_id; // Store the new publicId for potential cleanup

    const updatedImageData = {
      publicId: result.public_id,
      publicUrl: result.secure_url,
      originalName: data.image.name,
    };

    await updatePizzaImageDal(idData.id, updatedImageData);

    await deleteCloudinaryImage(oldPublicId);

    revalidatePath(`/pizzas`);
    revalidatePath(`/dashboard/pizzas`);
    return handleResponse(true, BACKEND_RESPONSE_MESSAGES.SUCCESS);
  } catch (error) {
    if (newPublicId) {
      await deleteCloudinaryImage(newPublicId);
    }
    isDev()
      ? errorLogger(error, "server error - updatePizzaImageAction")
      : console.error("Error updating image:", error);
    return handleResponse(false, BACKEND_RESPONSE_MESSAGES.SERVER_ERROR);
  }
}
