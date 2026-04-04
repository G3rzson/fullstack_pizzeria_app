"use server";

import { revalidatePath } from "next/cache";
import { changePastaMenuDal } from "../_dal/pastaDal";
import { hasPermission } from "@/shared/Functions/hasPermission";
import { idValidator } from "@/shared/Functions/idValidator";
import { handleResponse } from "@/shared/Functions/handleResponse";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";
import { errorLogger } from "@/shared/Functions/errorLogger";
import isDev from "@/shared/Functions/isDev";

export async function changePastaMenuAction(
  pastaId: string,
  isAvailableOnMenu: boolean,
) {
  try {
    const permissionResult = await hasPermission();

    if (!permissionResult)
      return handleResponse(false, BACKEND_RESPONSE_MESSAGES.UNAUTHORIZED);

    const { success, data } = idValidator.safeParse({ id: pastaId });
    if (!success)
      return handleResponse(false, BACKEND_RESPONSE_MESSAGES.INVALID_ID);

    await changePastaMenuDal(data.id, !isAvailableOnMenu);

    revalidatePath("/pastas");
    revalidatePath("/dashboard/pastas");
    return handleResponse(true, BACKEND_RESPONSE_MESSAGES.SUCCESS);
  } catch (error) {
    isDev()
      ? errorLogger(error, "server error - changePastaMenuAction")
      : console.error("Error changing menu status:", error);
    return handleResponse(false, BACKEND_RESPONSE_MESSAGES.SERVER_ERROR);
  }
}
