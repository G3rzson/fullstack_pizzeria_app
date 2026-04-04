"use server";

import { revalidatePath } from "next/cache";
import { hasPermission } from "@/shared/Functions/hasPermission";
import { idValidator } from "@/shared/Functions/idValidator";
import { imageSchema } from "@/shared/Validation/ImageSchema";
import { uploadImageToCloudinary } from "@/shared/Functions/uploadImageToCloudinary";
import { deleteCloudinaryImage } from "@/shared/Functions/deleteCloudinaryImage";
import { uploadPastaImageDal } from "../_dal/pastaDal";
import { handleResponse } from "@/shared/Functions/handleResponse";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";
import { errorLogger } from "@/shared/Functions/errorLogger";
import isDev from "@/shared/Functions/isDev";

export async function uploadPastaImageAction(
  pastaId: string,
  pastaImage: unknown,
) {
  let publicId: string | null = null;
  try {
    const permissionResult = await hasPermission();

    if (!permissionResult) {
      return handleResponse(false, BACKEND_RESPONSE_MESSAGES.UNAUTHORIZED);
    }

    const { success: successId, data: idData } = idValidator.safeParse({
      id: pastaId,
    });
    if (!successId)
      return handleResponse(false, BACKEND_RESPONSE_MESSAGES.INVALID_ID);

    const { data, success } = await imageSchema.safeParseAsync({
      image: pastaImage,
    });

    if (!success || !data.image)
      return handleResponse(false, BACKEND_RESPONSE_MESSAGES.INVALID_DATA);

    const result = await uploadImageToCloudinary(data.image, "pastas");

    const imageData = {
      publicId: result.public_id,
      publicUrl: result.secure_url,
      originalName: data.image.name,
    };

    await uploadPastaImageDal(idData.id, imageData);

    publicId = result.public_id; // Store the publicId for potential cleanup
    revalidatePath(`/pastas`);
    revalidatePath(`/dashboard/pastas`);
    return handleResponse(true, BACKEND_RESPONSE_MESSAGES.SUCCESS);
  } catch (error) {
    if (publicId) {
      await deleteCloudinaryImage(publicId);
    }
    isDev()
      ? errorLogger(error, "server error - uploadPastaImageAction")
      : console.error("Error uploading image:", error);
    return handleResponse(false, BACKEND_RESPONSE_MESSAGES.SERVER_ERROR);
  }
}
