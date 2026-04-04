"use server";
import prisma from "@/prisma/prisma";
import type { Prisma } from "@prisma/client";

export async function createPizzaDal(data: Prisma.PizzaCreateInput) {
  return await prisma.pizza.create({ data });
}

export async function getAllPizzaDal() {
  return await prisma.pizza.findMany({
    include: {
      image: true,
    },
  });
}

export async function changePizzaMenuDal(
  pizzaId: string,
  isAvailableOnMenu: boolean,
) {
  return await prisma.pizza.update({
    where: { id: pizzaId },
    data: { isAvailableOnMenu },
  });
}

export async function deletePizzaDal(pizzaId: string) {
  return await prisma.pizza.delete({
    where: { id: pizzaId },
  });
}

export async function updatePizzaDal(
  pizzaId: string,
  data: Prisma.PizzaUpdateInput,
) {
  return await prisma.pizza.update({
    where: { id: pizzaId },
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
  pizzaId: string,
  imageData: Prisma.ImageCreateWithoutPizzaInput,
) {
  return await prisma.pizza.update({
    where: { id: pizzaId },
    data: {
      image: {
        create: imageData,
      },
    },
  });
}

export async function updatePizzaImageDal(
  pizzaId: string,
  imageData: Prisma.ImageUpdateInput,
) {
  return await prisma.image.update({
    where: { pizzaId },
    data: imageData,
  });
}
