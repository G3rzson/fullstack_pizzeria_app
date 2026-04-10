"use server";

import { getUserFromCookie } from "@/lib/auth/getUserFromCookie";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";
import { errorLogger } from "@/shared/Functions/errorLogger";
import { handleResponse } from "@/shared/Functions/handleResponse";
import { hasPermission } from "@/shared/Functions/hasPermission";
import { idValidator } from "@/shared/Functions/idValidator";
import isDev from "@/shared/Functions/isDev";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { deleteUserDal } from "../_dal/usersDal";

export async function deleteUserAction(userId: string) {
  try {
    const permissionResult = await hasPermission();

    if (!permissionResult)
      return handleResponse(false, BACKEND_RESPONSE_MESSAGES.UNAUTHORIZED);

    const { success, data } = idValidator.safeParse({ id: userId });
    if (!success)
      return handleResponse(false, BACKEND_RESPONSE_MESSAGES.INVALID_ID);

    const currentUser = await getUserFromCookie();
    const isSelfDelete = currentUser?.id === data.id;

    await deleteUserDal(data.id);

    if (isSelfDelete) {
      const cookieStore = await cookies();
      cookieStore.delete("access_token");
      cookieStore.delete("refresh_token");
    }

    revalidatePath(`/dashboard/users`);

    return handleResponse(true, BACKEND_RESPONSE_MESSAGES.SUCCESS, {
      isSelfDelete,
    });
  } catch (error) {
    isDev()
      ? errorLogger(error, "server error - deleteUserAction")
      : console.error("Error deleting user:", error);
    return handleResponse(false, BACKEND_RESPONSE_MESSAGES.SERVER_ERROR);
  }
}
