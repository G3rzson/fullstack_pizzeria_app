"use server";

import prisma from "@/prisma/prisma";
import { BackendPizzaType, FrontendPizzaType } from "../Types/types";

export async function createPizzaDal(data: FrontendPizzaType) {
  await prisma.pizza.create({ data });
}

export async function getAllPizzaDal(): Promise<BackendPizzaType[]> {
  const pizzasArray = await prisma.pizza.findMany();
  return pizzasArray;
}

export async function getAllAvailablePizzaDal(): Promise<BackendPizzaType[]> {
  const pizzasArray = await prisma.pizza.findMany({
    where: {
      isAvailableOnMenu: true,
    },
  });
  return pizzasArray;
}

export async function changeMenuDal(
  pizzaId: string,
  isAvailableOnMenu: boolean,
) {
  await prisma.pizza.update({
    where: { id: pizzaId },
    data: { isAvailableOnMenu },
  });
}
