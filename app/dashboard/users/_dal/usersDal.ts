import prisma from "@/prisma/prisma";

export async function getAllUserDal() {
  return await prisma.user.findMany({
    include: {
      orderAddress: true,
    },
  });
}

export async function deleteUserDal(userId: string) {
  await prisma.user.delete({
    where: {
      id: userId,
    },
  });
}
