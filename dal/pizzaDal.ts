"use server";

import prisma from "@/prisma/prisma";

// create new pizza in database
export async function createPizzaDal(pizzaData: {
  pizzaName: string;
  pizzaPrice32: number;
  pizzaPrice45: number;
  pizzaDescription: string;
}) {
  await prisma.pizza.create({
    data: pizzaData,
  });
}

// get all pizza from database
export async function getAllPizzaDal() {
  const pizzaArray = await prisma.pizza.findMany({
    select: {
      id: true,
      pizzaName: true,
      pizzaPrice32: true,
      pizzaPrice45: true,
      pizzaDescription: true,
    },
  });

  return pizzaArray;
}

// delete pizza by id
export async function deletePizzaDal(pizzaId: string) {
  await prisma.pizza.delete({
    where: { id: pizzaId },
  });
}

// get one pizza by id
export async function getOnePizzaByIdDal(pizzaId: string) {
  const pizzaObj = await prisma.pizza.findUnique({
    where: { id: pizzaId },
    select: {
      id: true,
      pizzaName: true,
      pizzaPrice32: true,
      pizzaPrice45: true,
      pizzaDescription: true,
    },
  });
  return pizzaObj;
}

// update pizza by id
export async function updatePizzaDal(
  pizzaId: string,
  pizzaData: {
    pizzaName: string;
    pizzaPrice32: number;
    pizzaPrice45: number;
    pizzaDescription: string;
  },
) {
  await prisma.pizza.update({
    where: { id: pizzaId },
    data: pizzaData,
  });
}
