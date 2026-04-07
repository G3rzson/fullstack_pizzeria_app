"use server";

import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";
import { errorLogger } from "@/shared/Functions/errorLogger";
import { handleResponse } from "@/shared/Functions/handleResponse";
import isDev from "@/shared/Functions/isDev";
import { getAllUserDal } from "../_dal/usersDal";
import { AdminUserDtoType } from "@/shared/Types/types";

export async function getAllUserAction(): Promise<{
  success: boolean;
  message: string;
  data?: AdminUserDtoType[];
}> {
  try {
    const usersArray = await getAllUserDal();

    const usersDtoArray: AdminUserDtoType[] = usersArray.map((user) => ({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      orderAddress: user.orderAddress
        ? {
            id: user.orderAddress.id,
            fullName: user.orderAddress.fullName,
            phoneNumber: user.orderAddress.phoneNumber,
            postalCode: user.orderAddress.postalCode,
            city: user.orderAddress.city,
            street: user.orderAddress.street,
            houseNumber: user.orderAddress.houseNumber,
            floorAndDoor: user.orderAddress.floorAndDoor,
            isSaved: user.orderAddress.isSaved,
          }
        : null,
    }));

    return handleResponse(
      true,
      BACKEND_RESPONSE_MESSAGES.SUCCESS,
      usersDtoArray,
    );
  } catch (error) {
    isDev()
      ? errorLogger(error, "server error - getAllUserAction")
      : console.error("Error fetching users:", error);
    return handleResponse(false, BACKEND_RESPONSE_MESSAGES.SERVER_ERROR);
  }
}
