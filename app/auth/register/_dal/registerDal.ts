import prisma from "@/prisma/prisma";
import { Prisma } from "@prisma/client";

export async function registerDal(newUser: Prisma.UserCreateInput) {
  return await prisma.user.create({ data: newUser });
}
