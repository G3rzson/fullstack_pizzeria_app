"use server";

import { getAuthUser } from "@/shared/auth/requireAuth";
import prisma from "@/prisma/prisma";

/**
 * Ensures the current user is authenticated and has admin role.
 * Throws an error if not authenticated or not admin.
 * Use this in server actions that require admin privileges.
 *
 * This function automatically refreshes the access token if it expired
 * but the refresh token is still valid.
 */
export async function requireAdmin(): Promise<void> {
  // getAuthUser automatically handles token refresh
  const authPayload = await getAuthUser();

  if (!authPayload) {
    throw new Error("Nem vagy bejelentkezve!");
  }

  const user = await prisma.user.findUnique({
    where: { id: authPayload.sub },
    select: { role: true },
  });

  if (user?.role !== "ADMIN") {
    throw new Error("Nincs jogosultságod ehhez a művelethez!");
  }
}
