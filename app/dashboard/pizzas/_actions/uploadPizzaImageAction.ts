"use server";

import { revalidatePath } from "next/cache";
import { idValidator } from "@/shared/Functions/idValidator";
import { imageSchema } from "@/shared/Validation/ImageSchema";
import { uploadImageToCloudinary } from "@/lib/claudinary/uploadImageToCloudinary";
import { uploadPizzaImageDal } from "@/app/dashboard/pizzas/_dal/pizzaDal";
import { deleteCloudinaryImage } from "@/lib/claudinary/deleteCloudinaryImage";
import { handleResponse } from "@/shared/Functions/handleResponse";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";
import { errorLogger } from "@/shared/Functions/errorLogger";
import isDev from "@/shared/Functions/isDev";
import { hasPermission } from "@/shared/Functions/hasPermission";

export async function uploadPizzaImageAction(id: string, pizzaImage: unknown) {
  let publicId: string | null = null;

  try {
    const permissionResult = await hasPermission();
    if (!permissionResult)
      return handleResponse(false, BACKEND_RESPONSE_MESSAGES.UNAUTHORIZED);

    const { success: successId, data: idData } = idValidator.safeParse({ id });
    if (!successId)
      return handleResponse(false, BACKEND_RESPONSE_MESSAGES.INVALID_ID);

    const { data, success } = await imageSchema.safeParseAsync({
      image: pizzaImage,
    });

    if (!success || !data.image)
      return handleResponse(false, BACKEND_RESPONSE_MESSAGES.INVALID_DATA);

    const result = await uploadImageToCloudinary(data.image, "pizzas");
    publicId = result.public_id;

    const imageData = {
      publicId: result.public_id,
      publicUrl: result.secure_url,
      originalName: data.image.name,
    };

    await uploadPizzaImageDal(idData.id, imageData);

    revalidatePath(`/pizzas`);
    revalidatePath(`/dashboard/pizzas`);
    return handleResponse(true, BACKEND_RESPONSE_MESSAGES.SUCCESS);
  } catch (error) {
    if (publicId) {
      await deleteCloudinaryImage(publicId);
    }
    isDev()
      ? errorLogger(error, "server error - uploadPizzaImageAction")
      : console.error("Error uploading image:", error);

    return handleResponse(false, BACKEND_RESPONSE_MESSAGES.SERVER_ERROR);
  }
}
