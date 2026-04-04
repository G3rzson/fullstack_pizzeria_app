"use server";
import prisma from "@/prisma/prisma";
import type { Prisma } from "@prisma/client";

export async function createDrinkDal(data: Prisma.DrinkCreateInput) {
  return await prisma.drink.create({ data });
}

export async function getAllDrinkDal() {
  return await prisma.drink.findMany({
    include: {
      image: true,
    },
  });
}

export async function changeDrinkMenuDal(
  drinkId: string,
  isAvailableOnMenu: boolean,
) {
  return await prisma.drink.update({
    where: { id: drinkId },
    data: { isAvailableOnMenu },
  });
}

export async function deleteDrinkDal(drinkId: string) {
  return await prisma.drink.delete({
    where: { id: drinkId },
  });
}

export async function updateDrinkDal(
  drinkId: string,
  data: Prisma.DrinkUpdateInput,
) {
  return await prisma.drink.update({
    where: { id: drinkId },
    data,
  });
}

export async function getDrinkByIdDal(drinkId: string) {
  return await prisma.drink.findUnique({
    where: { id: drinkId },
    include: { image: true },
  });
}

export async function uploadDrinkImageDal(
  drinkId: string,
  imageData: Prisma.ImageCreateWithoutDrinkInput,
) {
  return await prisma.drink.update({
    where: { id: drinkId },
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
  return await prisma.image.update({
    where: { drinkId },
    data: imageData,
  });
}
