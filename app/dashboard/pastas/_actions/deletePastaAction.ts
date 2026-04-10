"use server";

import { revalidatePath } from "next/cache";
import { idValidator } from "@/shared/Functions/idValidator";
import { deletePastaDal } from "../_dal/pastaDal";
import { handleResponse } from "@/shared/Functions/handleResponse";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";
import { errorLogger } from "@/shared/Functions/errorLogger";
import isDev from "@/shared/Functions/isDev";
import { hasPermission } from "@/shared/Functions/hasPermission";

export async function deletePastaAction(
  pastaId: string,
  publicId: string | null,
) {
  try {
    const permissionResult = await hasPermission();

    if (!permissionResult)
      return handleResponse(false, BACKEND_RESPONSE_MESSAGES.UNAUTHORIZED);

    const { success, data } = idValidator.safeParse({ id: pastaId });
    if (!success)
      return handleResponse(false, BACKEND_RESPONSE_MESSAGES.INVALID_ID);

    await deletePastaDal(data.id);

    if (publicId) {
      const { deleteCloudinaryImage } =
        await import("@/lib/claudinary/deleteCloudinaryImage");
      await deleteCloudinaryImage(publicId);
    }

    revalidatePath("/pastas");
    revalidatePath("/dashboard/pastas");
    return handleResponse(true, BACKEND_RESPONSE_MESSAGES.SUCCESS);
  } catch (error) {
    isDev()
      ? errorLogger(error, "server error - deletePastaAction")
      : console.error("Error deleting pasta:", error);
    return handleResponse(false, BACKEND_RESPONSE_MESSAGES.SERVER_ERROR);
  }
}
