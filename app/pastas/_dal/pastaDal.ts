"use server";
import prisma from "@/prisma/prisma";

export async function getAllAvailablePastaDal() {
  const pastasArray = await prisma.pasta.findMany({
    where: {
      isAvailableOnMenu: true,
    },
    include: {
      image: true,
    },
  });
  return pastasArray;
}
