"use server";

import { registerDal } from "../Dal/userDal";
import { registerSchema } from "../Validation/registerShema";
import bcrypt from "bcrypt";

export async function registerAction(registerData: unknown) {
  const { data, success } = await registerSchema.safeParseAsync(registerData);

  if (!success) {
    console.error("Validation error:", data);
    return {
      success: false,
      message: "Hibás adatok! Kérlek ellenőrizd a megadott információkat.",
    };
  }

  try {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = {
      username: data.username,
      email: data.email,
      password: hashedPassword,
    };

    await registerDal(newUser);
    return {
      success: true,
      message: "Felhasználó sikeresen regisztrálva!",
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "Szerverhiba történt! Próbáld újra később.",
    };
  }
}
