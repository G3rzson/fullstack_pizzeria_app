"use server";
import prisma from "@/prisma/prisma";
import type { Prisma } from "@prisma/client";

export async function createPizzaDal(data: Prisma.PizzaCreateInput) {
  await prisma.pizza.create({ data });
}

export async function getAllPizzaDal() {
  const pizzasArray = await prisma.pizza.findMany({
    include: {
      image: true,
    },
  });
  return pizzasArray;
}

export async function changePizzaMenuDal(
  id: string,
  isAvailableOnMenu: boolean,
) {
  await prisma.pizza.update({
    where: { id },
    data: { isAvailableOnMenu },
  });
}

export async function deletePizzaDal(id: string) {
  await prisma.pizza.delete({
    where: { id },
  });
}

export async function updatePizzaDal(
  id: string,
  data: Prisma.PizzaUpdateInput,
) {
  await prisma.pizza.update({
    where: { id },
    data,
  });
}

export async function getPizzaByIdDal(pizzaId: string) {
  return await prisma.pizza.findUnique({
    where: { id: pizzaId },
    include: { image: true },
  });
}

export async function uploadPizzaImageDal(
  id: string,
  imageData: Prisma.PizzaImageCreateWithoutPizzaInput,
) {
  await prisma.pizza.update({
    where: { id },
    data: {
      image: {
        create: imageData,
      },
    },
  });
}

export async function updatePizzaImageDal(
  id: string,
  imageData: Prisma.PizzaImageUpdateInput,
) {
  await prisma.pizzaImage.update({
    where: { id },
    data: imageData,
  });
}
