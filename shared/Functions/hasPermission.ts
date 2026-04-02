"use server";

import { getUserDal } from "@/app/auth/_dal/userDal";
import { getUserFromCookie } from "./getUserFromCookie";

export async function hasPermission() {
  const userDataFromCookie = await getUserFromCookie();

  if (!userDataFromCookie) return false;

  const userData = await getUserDal(userDataFromCookie.id);

  if (
    !userData ||
    userData.role !== "ADMIN" ||
    userData.isStillWorkingHere === false
  )
    return false;

  return { username: userData.username };
}
