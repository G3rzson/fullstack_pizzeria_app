"use server";

import prisma from "@/prisma/prisma";
import { RegisterUserSchemaType } from "@/validation/zodSchemas";

export async function createUserDal(user: RegisterUserSchemaType) {
  await prisma.user.create({ data: user });
}

/*
export async function getUserByUsernameDal(username: string) {
  return await prisma.user.findUnique({
    where: { username: username.trim() },
  });
}

export async function getUserByIdDal(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
  });
}
*/
