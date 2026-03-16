"use server";

import {
  BackendPizzaType,
  FrontendPizzaType,
} from "@/features/Pizzas/Types/types";
import prisma from "@/prisma/prisma";

export async function createPizzaDal(data: FrontendPizzaType) {
  await prisma.pizza.create({ data });
}

export async function getAllPizzaDal(): Promise<BackendPizzaType[]> {
  const pizzasArray = await prisma.pizza.findMany();
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

export async function deletePizzaDal(pizzaId: string) {
  await prisma.pizza.delete({
    where: { id: pizzaId },
  });
}

export async function getPizzaByIdDal(pizzaId: string) {
  const pizza = await prisma.pizza.findUnique({
    where: { id: pizzaId },
  });
  return pizza;
}

export async function updatePizzaDal(id: string, data: FrontendPizzaType) {
  await prisma.pizza.update({
    where: { id },
    data,
  });
}
