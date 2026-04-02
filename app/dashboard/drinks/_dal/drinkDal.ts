"use server";
import prisma from "@/prisma/prisma";
import type { Prisma } from "@prisma/client";

export async function createDrinkDal(data: Prisma.DrinkCreateInput) {
  await prisma.drink.create({ data });
}

export async function getAllDrinkDal() {
  const drinksArray = await prisma.drink.findMany({
    include: {
      image: true,
    },
  });
  return drinksArray;
}

export async function changeDrinkMenuDal(
  id: string,
  isAvailableOnMenu: boolean,
) {
  await prisma.drink.update({
    where: { id },
    data: { isAvailableOnMenu },
  });
}

export async function deleteDrinkDal(id: string) {
  await prisma.drink.delete({
    where: { id },
  });
}

export async function updateDrinkDal(
  id: string,
  data: Prisma.DrinkUpdateInput,
) {
  await prisma.drink.update({
    where: { id },
    data,
  });
}

export async function getDrinkByIdDal(id: string) {
  return await prisma.drink.findUnique({
    where: { id },
    include: { image: true },
  });
}

export async function uploadDrinkImageDal(
  id: string,
  imageData: Prisma.ImageCreateWithoutDrinkInput,
) {
  await prisma.drink.update({
    where: { id },
    data: {
      image: {
        create: imageData,
      },
    },
  });
}

export async function updateDrinkImageDal(
  drinkId: string,
  imageData: Prisma.ImageUpdateInput,
) {
  await prisma.image.update({
    where: { drinkId },
    data: imageData,
  });
}
