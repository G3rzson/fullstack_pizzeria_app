import { isUserAdmin } from "@/lib/isUserAdmin";
import { requireAuth } from "@/shared/auth/requireAuth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // First ensure user is authenticated (handles token refresh if needed)
  await requireAuth("/admin");

  // Then check if user is admin
  const isAdmin = await isUserAdmin();
  if (!isAdmin) {
    redirect("/");
  }

  return <>{children}</>;
}
