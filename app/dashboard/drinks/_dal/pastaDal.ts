"use server";
import prisma from "@/prisma/prisma";
import type { Prisma } from "@prisma/client";

export async function createPastaDal(data: Prisma.PastaCreateInput) {
  await prisma.pasta.create({ data });
}

export async function getAllPastaDal() {
  const pastasArray = await prisma.pasta.findMany({
    include: {
      image: true,
    },
  });
  return pastasArray;
}

export async function changePastaMenuDal(
  id: string,
  isAvailableOnMenu: boolean,
) {
  await prisma.pasta.update({
    where: { id },
    data: { isAvailableOnMenu },
  });
}

export async function deletePastaDal(id: string) {
  await prisma.pasta.delete({
    where: { id },
  });
}

export async function updatePastaDal(
  id: string,
  data: Prisma.PastaUpdateInput,
) {
  await prisma.pasta.update({
    where: { id },
    data,
  });
}

export async function getPastaByIdDal(id: string) {
  return await prisma.pasta.findUnique({
    where: { id },
    include: { image: true },
  });
}

export async function uploadPastaImageDal(
  id: string,
  imageData: Prisma.PastaImageCreateWithoutPastaInput,
) {
  await prisma.pasta.update({
    where: { id },
    data: {
      image: {
        create: imageData,
      },
    },
  });
}

export async function updatePastaImageDal(
  id: string,
  imageData: Prisma.PastaImageUpdateInput,
) {
  await prisma.pastaImage.update({
    where: { id },
    data: imageData,
  });
}
