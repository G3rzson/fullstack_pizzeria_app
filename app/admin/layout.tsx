import { isUserAdmin } from "@/lib/isUserAdmin";
import { redirect } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = isUserAdmin(); // Replace with actual authentication check logic

  if (!isAdmin) {
    redirect("/");
  }

  return <>{children}</>;
}
