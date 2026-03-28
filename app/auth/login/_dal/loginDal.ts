import prisma from "@/prisma/prisma";

export async function getUserByUsername(username: string) {
  return await prisma.user.findUnique({ where: { username } });
}
