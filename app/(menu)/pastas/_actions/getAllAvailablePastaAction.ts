"use server";

import isDev from "@/shared/Functions/isDev";
import { getAllAvailablePastaDal } from "../_dal/pastaDal";
import { errorLogger } from "@/shared/Functions/errorLogger";
import { handleResponse } from "@/shared/Functions/handleResponse";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";
import { type PastaDtoType } from "@/shared/Types/types";

export async function getAllAvailablePastaAction(): Promise<{
  success: boolean;
  message: string;
  data?: PastaDtoType[];
}> {
  try {
    const pastasArray = await getAllAvailablePastaDal();

    const pastaDto: PastaDtoType[] = pastasArray.map((pasta) => ({
      id: pasta.id,
      pastaName: pasta.pastaName,
      pastaPrice: pasta.pastaPrice,
      pastaDescription: pasta.pastaDescription,
      image: pasta.image
        ? {
            publicUrl: pasta.image.publicUrl,
          }
        : null,
    }));

    return handleResponse(true, BACKEND_RESPONSE_MESSAGES.SUCCESS, pastaDto);
  } catch (error) {
    isDev()
      ? errorLogger(error, "server error - getAllAvailablePastaAction")
      : console.error("Error fetching pastas:", error);
    return handleResponse(false, BACKEND_RESPONSE_MESSAGES.SERVER_ERROR);
  }
}
