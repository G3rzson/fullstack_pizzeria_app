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
  const pizzaArray = await prisma.pizza.findMany();

  // pizzaArray DTO
  const pizzaArrayDto = pizzaArray.map((pizza) => ({
    id: pizza.id,
    pizzaName: pizza.pizzaName,
    pizzaPrice32: pizza.pizzaPrice32,
    pizzaPrice45: pizza.pizzaPrice45,
    pizzaDescription: pizza.pizzaDescription,
  }));
  return pizzaArrayDto;
}

// delete pizza by id
export async function deletePizzaDal(pizzaId: string) {
  await prisma.pizza.delete({
    where: { id: pizzaId },
  });
}
