"use server";

import { cookies } from "next/headers";
import { createPizzaDal } from "../_dal/pizzaDal";
import { pizzaSchema } from "../_validation/pizzaSchema";
import { getJwtSecrets, verifyAccessToken } from "@/shared/Functions/jwt";
import prisma from "@/prisma/prisma";

export async function createPizzaAction(pizza: unknown) {
  const { data, success } = await pizzaSchema.safeParseAsync(pizza);

  const userDataFromCookie = await getUserFromCookie();

  if (!userDataFromCookie) {
    return {
      success: false,
      message: "Nincs bejelentkezve!",
    };
  }

  const userData = await getUserDal(userDataFromCookie.id);

  if (
    !userData ||
    userData.role !== "ADMIN" ||
    userData.isStillWorkingHere === false
  ) {
    return {
      success: false,
      message: "Nincs jogosultsága a művelet végrehajtásához!",
    };
  }

  if (!success) {
    return {
      success: false,
      message: "Érvénytelen adatok!",
    };
  }

  try {
    const newPizza = {
      ...data,
      category: "pizzák",
      createdBy: userData.username,
    };

    await createPizzaDal(newPizza);

    return { success: true, message: "Pizza sikeresen létrehozva!" };
  } catch (error) {
    console.error("Error creating pizza:", error);
    return {
      success: false,
      message: "Hiba történt a pizza létrehozása során.",
    };
  }
}

async function getUserFromCookie() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return null;
  }

  const jwtSecrets = getJwtSecrets();
  if (!jwtSecrets) {
    return null;
  }

  const verifiedToken = verifyAccessToken(
    accessToken,
    jwtSecrets.accessTokenSecret,
  );
  if (!verifiedToken) {
    return null;
  }

  const userData = {
    id: verifiedToken.id,
    username: verifiedToken.username,
    role: verifiedToken.role,
  };

  return userData;
}

async function getUserDal(userId: string) {
  return await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
}
