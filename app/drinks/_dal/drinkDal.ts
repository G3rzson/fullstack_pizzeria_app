"use server";
import prisma from "@/prisma/prisma";

export async function getAllAvailableDrinkDal() {
  const drinksArray = await prisma.drink.findMany({
    where: {
      isAvailableOnMenu: true,
    },
    include: {
      image: true,
    },
  });
  return drinksArray;
}
