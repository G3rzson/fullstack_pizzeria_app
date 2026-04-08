"use server";

import { revalidatePath } from "next/cache";
import { deleteCloudinaryImage } from "@/lib/claudinary/deleteCloudinaryImage";
import { uploadImageToCloudinary } from "@/lib/claudinary/uploadImageToCloudinary";
import { idValidator } from "@/shared/Functions/idValidator";
import { imageSchema } from "@/shared/Validation/ImageSchema";
import { updateDrinkImageDal } from "../_dal/drinkDal";
import { handleResponse } from "@/shared/Functions/handleResponse";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";
import { errorLogger } from "@/shared/Functions/errorLogger";
import isDev from "@/shared/Functions/isDev";
import { hasPermission } from "@/shared/Functions/hasPermission";

export async function updateDrinkImageAction(
  drinkId: string,
  drinkImage: unknown,
  publicId: string,
) {
  let newPublicId: string | null = null;

  try {
    const permissionResult = await hasPermission();
    if (!permissionResult)
      return handleResponse(false, BACKEND_RESPONSE_MESSAGES.UNAUTHORIZED);

    const { success: successId, data: idData } = idValidator.safeParse({
      id: drinkId,
    });
    if (!successId)
      return handleResponse(false, BACKEND_RESPONSE_MESSAGES.INVALID_ID);

    const { data, success } = await imageSchema.safeParseAsync({
      image: drinkImage,
    });
    const oldPublicId = publicId; // Store the old publicId for potential cleanup

    if (!success || !data.image)
      return handleResponse(false, BACKEND_RESPONSE_MESSAGES.INVALID_DATA);

    const result = await uploadImageToCloudinary(data.image, "drinks");

    newPublicId = result.public_id; // Store the new publicId for potential cleanup

    const updatedImageData = {
      publicId: result.public_id,
      publicUrl: result.secure_url,
      originalName: data.image.name,
    };

    await updateDrinkImageDal(idData.id, updatedImageData);

    await deleteCloudinaryImage(oldPublicId);

    revalidatePath(`/drinks`);
    revalidatePath(`/dashboard/drinks`);
    return handleResponse(true, BACKEND_RESPONSE_MESSAGES.SUCCESS);
  } catch (error) {
    if (newPublicId) {
      await deleteCloudinaryImage(newPublicId);
    }
    isDev()
      ? errorLogger(error, "server error - updateDrinkImageAction")
      : console.error("Error updating image:", error);
    return handleResponse(false, BACKEND_RESPONSE_MESSAGES.SERVER_ERROR);
  }
}
