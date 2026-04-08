"use server";
import prisma from "@/prisma/prisma";

export async function getAllAvailablePastaDal() {
  return await prisma.pasta.findMany({
    where: {
      isAvailableOnMenu: true,
    },
    include: {
      image: true,
    },
  });
}
