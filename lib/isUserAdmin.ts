import { getAuthUser } from "@/shared/auth/requireAuth";
import prisma from "@/prisma/prisma";

export async function isUserAdmin(): Promise<boolean> {
  try {
    // Get authenticated user (only checks access token, doesn't handle refresh)
    const authPayload = await getAuthUser();

    if (!authPayload) {
      return false;
    }

    // Get user from database and check role
    const user = await prisma.user.findUnique({
      where: { id: authPayload.sub },
      select: { role: true },
    });

    return user?.role === "ADMIN";
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}
