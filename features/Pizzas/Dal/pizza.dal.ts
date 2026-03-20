"use server";

import prisma from "@/prisma/prisma";

export type ImageType = {
  id: string;
  publicUrl: string;
  originalName: string;
  publicId: string;
  pizzaId: string;
};

type PizzaType = {
  id: string;
  pizzaName: string;
  pizzaPrice32: number;
  pizzaPrice45: number;
  pizzaDescription: string;
  isAvailableOnMenu: boolean;
  createdBy: string;
  category: string;
};

export type PizzaWithImageType = PizzaType & {
  image: ImageType | null;
};

export async function getAllAvailablePizzaDal(): Promise<PizzaWithImageType[]> {
  const pizzasArray = await prisma.pizza.findMany({
    where: {
      isAvailableOnMenu: true,
    },
    include: {
      image: true,
    },
  });
  return pizzasArray;
}
