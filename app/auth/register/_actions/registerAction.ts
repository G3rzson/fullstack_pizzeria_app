"use server";

import { Prisma } from "@prisma/client";
import { REGISTER_INFO } from "../_constants/info";
import { registerDal } from "../_dal/registerDal";
import { registerSchema } from "../_validation/registerSchema";
import bcrypt from "bcrypt";
import { handleResponse } from "@/shared/Functions/handleResponse";
import { errorLogger } from "@/shared/Functions/errorLogger";

export async function registerAction(formData: unknown) {
  try {
    const result = await registerSchema.safeParseAsync(formData);

    // validációs hiba kezelése, ha a bemeneti adatok nem felelnek meg a sémának
    if (!result.success) {
      await errorLogger(result.error, "registerAction - validation error");
      return handleResponse(false, REGISTER_INFO.validationError);
    }

    const hashedPassword = await bcrypt.hash(result.data.password, 10);

    const newUser = {
      username: result.data.username,
      email: result.data.email,
      password: hashedPassword,
    };

    await registerDal(newUser);

    return handleResponse(true, REGISTER_INFO.success);
  } catch (error) {
    // Prisma specifikus hiba kezelés, ha a email vagy username már létezik
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      await errorLogger(error, "registerAction - db duplicate error");
      return handleResponse(false, REGISTER_INFO.duplicateError);
    }

    // Általános hiba kezelés
    await errorLogger(error, "registerAction - server error");
    return handleResponse(false, REGISTER_INFO.serverError);
  }
}
