"use server";

import { idValidator } from "@/shared/Functions/idValidator";
import { getPastaByIdDal } from "../_dal/pastaDal";
import { hasPermission } from "@/shared/Functions/hasPermission";
import { handleResponse } from "@/shared/Functions/handleResponse";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";
import { AdminPastaDtoType } from "@/shared/Types/types";
import { errorLogger } from "@/shared/Functions/errorLogger";
import isDev from "@/shared/Functions/isDev";

export async function getPastaByIdAction(id: string): Promise<{
  success: boolean;
  message: string;
  data?: AdminPastaDtoType;
}> {
  try {
    const permissionResult = await hasPermission();

    if (!permissionResult)
      return handleResponse(false, BACKEND_RESPONSE_MESSAGES.UNAUTHORIZED);

    const { success, data } = idValidator.safeParse({ id });
    if (!success)
      return handleResponse(false, BACKEND_RESPONSE_MESSAGES.INVALID_ID);

    const pasta = await getPastaByIdDal(data.id);

    if (!pasta)
      return handleResponse(false, BACKEND_RESPONSE_MESSAGES.NOT_FOUND);

    const AdminPastaDto: AdminPastaDtoType = {
      id: pasta.id,
      pastaName: pasta.pastaName,
      pastaDescription: pasta.pastaDescription,
      pastaPrice: pasta.pastaPrice,
      isAvailableOnMenu: pasta.isAvailableOnMenu,
      image: pasta.image
        ? {
            id: pasta.image.id,
            pastaId: pasta.image.pastaId,
            publicId: pasta.image.publicId,
            publicUrl: pasta.image.publicUrl,
            originalName: pasta.image.originalName,
          }
        : null,
    };

    return handleResponse(
      true,
      BACKEND_RESPONSE_MESSAGES.SUCCESS,
      AdminPastaDto,
    );
  } catch (error) {
    isDev()
      ? errorLogger(error, "server error - getPastaByIdAction")
      : console.error("Error fetching pasta by ID:", error);
    return handleResponse(false, BACKEND_RESPONSE_MESSAGES.SERVER_ERROR);
  }
}
