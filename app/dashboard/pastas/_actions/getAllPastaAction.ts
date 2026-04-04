"use server";

import { type AdminPastaDtoType } from "@/shared/Types/types";
import { getAllPastaDal } from "../_dal/pastaDal";
import { handleResponse } from "@/shared/Functions/handleResponse";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";
import { errorLogger } from "@/shared/Functions/errorLogger";
import isDev from "@/shared/Functions/isDev";

export async function getAllPastaAction(): Promise<{
  success: boolean;
  message: string;
  data?: AdminPastaDtoType[];
}> {
  try {
    const pastasArray = await getAllPastaDal();

    const AdminPastaDto: AdminPastaDtoType[] = pastasArray.map((pasta) => ({
      id: pasta.id,
      pastaName: pasta.pastaName,
      pastaPrice: pasta.pastaPrice,
      pastaDescription: pasta.pastaDescription,
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
    }));

    return handleResponse(
      true,
      BACKEND_RESPONSE_MESSAGES.SUCCESS,
      AdminPastaDto,
    );
  } catch (error) {
    isDev()
      ? errorLogger(error, "server error - getAllAvailablePastaAction")
      : console.error("Error fetching pastas:", error);
    return handleResponse(false, BACKEND_RESPONSE_MESSAGES.SERVER_ERROR);
  }
}
