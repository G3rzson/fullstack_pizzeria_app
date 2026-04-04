"use server";
import prisma from "@/prisma/prisma";

export async function getAllAvailablePizzaDal() {
  return await prisma.pizza.findMany({
    where: {
      isAvailableOnMenu: true,
    },
    include: {
      image: true,
    },
  });
}
