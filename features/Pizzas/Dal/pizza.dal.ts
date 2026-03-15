"use server";

import prisma from "@/prisma/prisma";

export type PizzaCreateType = {
  pizzaName: string;
  pizzaPrice32: number;
  pizzaPrice45: number;
  pizzaDescription: string;
  isAvailableOnMenu: boolean;
  publicId?: string;
  originalName?: string;
  publicUrl?: string;
  createdBy?: string;
};

export type PizzaGetType = {
  id: string;
  pizzaName: string;
  pizzaPrice32: number;
  pizzaPrice45: number;
  pizzaDescription: string;
  isAvailableOnMenu: boolean;
  publicId: string | null;
  originalName: string | null;
  publicUrl: string | null;
  createdBy: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export async function createPizzaDal(data: PizzaCreateType) {
  await prisma.pizza.create({ data });
}

export async function getAllPizzaDal(): Promise<PizzaGetType[]> {
  const pizzasArray = await prisma.pizza.findMany();
  return pizzasArray;
}

export async function getAllAvailablePizzaDal(): Promise<PizzaGetType[]> {
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
