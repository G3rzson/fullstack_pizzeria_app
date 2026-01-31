"use server";

import bcrypt from "bcrypt";
import { registerUserSchema } from "@/validation/zodSchemas";
import { createUserDal } from "@/dal/userDal";

export async function registerUserAction(data: unknown) {
  const validUserDataObj = registerUserSchema.safeParse(data);
  if (!validUserDataObj.success) {
    return {
      success: false,
      message: "Invalid input",
    };
  }

  const hashedPassword = await bcrypt.hash(validUserDataObj.data.password, 10);

  const newUser = {
    username: validUserDataObj.data.username,
    email: validUserDataObj.data.email.toLowerCase(),
    password: hashedPassword,
  };

  try {
    await createUserDal(newUser);
    return { success: true, message: "User registered successfully" };
  } catch (error) {
    console.error("Error registering user:", error);
    return { success: false, message: "Error registering user" };
  }
}

/*
export async function loginUserAction(data: unknown) {
  const validUserDataObj = loginUserSchema.safeParse(data);
  if (!validUserDataObj.success) {
    return {
      success: false as const,
      message: "Invalid input",
      errors: validUserDataObj.error.flatten(),
    };
  }

  try {
    const user = await getUserByUsernameDal(validUserDataObj.data.username);
    if (!user) {
      return {
        success: false as const,
        message: "Invalid username or password",
      };
    }

    const isValidPassword = await bcrypt.compare(
      validUserDataObj.data.password,
      user.password,
    );

    if (!isValidPassword) {
      return {
        success: false as const,
        message: "Invalid username or password",
      };
    }

    const accessToken = signAccessToken({ userId: user.id, role: user.role });
    const refreshToken = signRefreshToken({ userId: user.id });

    // cookie beállítása
    const cookieStore = await cookies();
    cookieStore.set({
      name: "accessToken",
      value: accessToken,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 15 * 60, // 15 perc
    });

    cookieStore.set({
      name: "refreshToken",
      value: refreshToken,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 nap
    });

    return { success: true as const, message: "User logged in successfully" };
  } catch (error) {
    console.error("Error logging in user:", error);
    return { success: false as const, message: "Error logging in user" };
  }
}
*/
