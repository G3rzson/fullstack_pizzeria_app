"use server";
import prisma from "@/prisma/prisma";
import type { Prisma } from "@prisma/client";

export async function createPastaDal(data: Prisma.PastaCreateInput) {
  return await prisma.pasta.create({ data });
}

export async function getAllPastaDal() {
  return await prisma.pasta.findMany({
    include: {
      image: true,
    },
  });
}

export async function changePastaMenuDal(
  pastaId: string,
  isAvailableOnMenu: boolean,
) {
  return await prisma.pasta.update({
    where: { id: pastaId },
    data: { isAvailableOnMenu },
  });
}

export async function deletePastaDal(pastaId: string) {
  return await prisma.pasta.delete({
    where: { id: pastaId },
  });
}

export async function updatePastaDal(
  pastaId: string,
  data: Prisma.PastaUpdateInput,
) {
  return await prisma.pasta.update({
    where: { id: pastaId },
    data,
  });
}

export async function getPastaByIdDal(pastaId: string) {
  return await prisma.pasta.findUnique({
    where: { id: pastaId },
    include: { image: true },
  });
}

export async function uploadPastaImageDal(
  pastaId: string,
  imageData: Prisma.ImageCreateWithoutPastaInput,
) {
  return await prisma.pasta.update({
    where: { id: pastaId },
    data: {
      image: {
        create: imageData,
      },
    },
  });
}

export async function updatePastaImageDal(
  pastaId: string,
  imageData: Prisma.ImageUpdateInput,
) {
  return await prisma.image.update({
    where: { pastaId },
    data: imageData,
  });
}
