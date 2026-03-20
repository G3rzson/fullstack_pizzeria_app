"use server";
import prisma from "@/prisma/prisma";
import { Prisma } from "@prisma/client";

type FrontendPizzaType = {
  PizzaName: string;
  description: string;
  price: number;
  isAvailableOnMenu: boolean;
};

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

export async function updatePizzaDal(
  id: string,
  data: Prisma.PizzaUpdateInput,
) {
  await prisma.pizza.update({
    where: { id },
    data,
  });
}

export async function uploadImageDal(
  pizzaId: string,
  imageData: { publicId: string; publicUrl: string; originalName: string },
) {
  await prisma.pizza.update({
    where: { id: pizzaId },
    data: {
      image: {
        create: imageData,
      },
    },
  });
}

export async function getPizzaByIdDal(pizzaId: string) {
  const pizza = await prisma.pizza.findUnique({
    where: { id: pizzaId },
    include: { image: true },
  });
  return pizza;
}

export async function updateImageDal(
  pizzaId: string,
  imageData: { publicId: string; publicUrl: string; originalName: string },
) {
  await prisma.pizzaImage.update({
    where: { pizzaId },
    data: imageData,
  });
}
