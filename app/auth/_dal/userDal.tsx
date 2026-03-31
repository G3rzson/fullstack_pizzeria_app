"use server";

import prisma from "@/prisma/prisma";

export async function getUserDal(userId: string) {
  return await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
}
