"use server";

import prisma from "@/prisma/prisma";
import { Prisma } from "@prisma/client";

export async function saveAddressDal(
  userId: string,
  data: Omit<Prisma.OrderAddressCreateInput, "users">,
) {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      orderAddress: {
        create: data,
      },
    },
    include: {
      orderAddress: true,
    },
  });
}

export async function getAddressByUserIdDal(userId: string) {
  return await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      orderAddress: true,
    },
  });
}

export async function updateAddressDal(
  userId: string,
  data: Omit<Prisma.OrderAddressUpdateInput, "users">,
) {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      orderAddress: {
        update: data,
      },
    },
    include: {
      orderAddress: true,
    },
  });
}
