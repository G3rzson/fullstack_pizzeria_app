import prisma from "@/prisma/prisma";

export type PizzaImageType = {
  originalName: string;
  storedName: string;
  mimeType: string;
  size: number;
  path: string;
};

export type PizzaCreateType = {
  pizzaName: string;
  pizzaPrice32: number;
  pizzaPrice45: number;
  pizzaDescription: string;
  isAvailableOnMenu: boolean;
  createdBy?: string;
} & Partial<PizzaImageType>;

export async function createPizzaDal(data: PizzaCreateType) {
  await prisma.pizza.create({ data });
}
