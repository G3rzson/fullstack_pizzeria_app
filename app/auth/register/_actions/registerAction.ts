"use server";

import { Prisma } from "@prisma/client";
import { registerDal } from "../_dal/registerDal";
import { registerSchema } from "../_validation/registerSchema";
import bcrypt from "bcrypt";
import { handleResponse } from "@/shared/Functions/handleResponse";
import { errorLogger } from "@/shared/Functions/errorLogger";
import isDev from "@/shared/Functions/isDev";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";

export async function registerAction(data: unknown) {
  try {
    const result = await registerSchema.safeParseAsync(data);

    if (!result.success)
      return handleResponse(false, BACKEND_RESPONSE_MESSAGES.INVALID_DATA);

    const hashedPassword = await bcrypt.hash(result.data.password, 10);

    const newUser = {
      username: result.data.username,
      email: result.data.email,
      password: hashedPassword,
    };

    await registerDal(newUser);

    return handleResponse(true, BACKEND_RESPONSE_MESSAGES.SUCCESS);
  } catch (error) {
    // Prisma specifikus hiba kezelés, ha a email vagy username már létezik
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    )
      return handleResponse(false, BACKEND_RESPONSE_MESSAGES.DUPLICATE_ERROR);

    isDev()
      ? await errorLogger(error, "server error - registerAction")
      : console.error("Error registering user:", error);
    return handleResponse(false, BACKEND_RESPONSE_MESSAGES.SERVER_ERROR);
  }
}
