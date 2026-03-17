"use server";

import prisma from "@/prisma/prisma";

export async function getAllAvailablePizzaDal(): Promise<any[]> {
  const pizzasArray = await prisma.pizza.findMany({
    where: {
      isAvailableOnMenu: true,
    },
  });
  return pizzasArray;
}
