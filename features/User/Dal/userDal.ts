import prisma from "@/prisma/prisma";
import { Prisma } from "@prisma/client";

export async function registerDal(newUser: Prisma.UserCreateInput) {
  await prisma.user.create({ data: newUser });
}

export async function getUserByUsername(username: string) {
  return await prisma.user.findUnique({ where: { username } });
}
