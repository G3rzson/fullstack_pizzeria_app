"use server";
import prisma from "@/prisma/prisma";

export async function getAllAvailableDrinkDal() {
  return await prisma.drink.findMany({
    where: {
      isAvailableOnMenu: true,
    },
    include: {
      image: true,
    },
  });
}
