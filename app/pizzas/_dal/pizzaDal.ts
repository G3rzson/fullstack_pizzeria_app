"use server";
import prisma from "@/prisma/prisma";

export async function getAllAvailablePizzaDal() {
  const pizzasArray = await prisma.pizza.findMany({
    where: {
      isAvailableOnMenu: true,
    },
    include: {
      image: true,
    },
  });
  return pizzasArray;
}
