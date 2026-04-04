"use server";

import { revalidatePath } from "next/cache";
import { pastaSchema } from "../_validation/pastaSchema";
import { hasPermission } from "@/shared/Functions/hasPermission";
import { createPastaDal } from "../_dal/pastaDal";
import { handleResponse } from "@/shared/Functions/handleResponse";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";
import { errorLogger } from "@/shared/Functions/errorLogger";
import isDev from "@/shared/Functions/isDev";

export async function createPastaAction(pasta: unknown) {
  try {
    const permissionResult = await hasPermission();

    if (!permissionResult)
      return handleResponse(false, BACKEND_RESPONSE_MESSAGES.UNAUTHORIZED);

    const { data, success } = await pastaSchema.safeParseAsync(pasta);

    if (!success)
      return handleResponse(false, BACKEND_RESPONSE_MESSAGES.INVALID_DATA);

    const newPasta = {
      ...data,
      category: "pasták",
      createdBy: permissionResult.username,
    };

    await createPastaDal(newPasta);

    revalidatePath(`/pastas`);
    revalidatePath(`/dashboard/pastas`);
    return handleResponse(true, BACKEND_RESPONSE_MESSAGES.SUCCESS);
  } catch (error) {
    isDev()
      ? errorLogger(error, "server error - createPastaAction")
      : console.error("Error creating pasta:", error);
    return handleResponse(false, BACKEND_RESPONSE_MESSAGES.SERVER_ERROR);
  }
}
