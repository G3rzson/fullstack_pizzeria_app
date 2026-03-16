import CustomLink from "@/components/ui/CustomLink";
import AdminPizzaList from "@/features/Admin/Components/AdminPizzaList";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default function AdminPage() {
  const isAdmin = true; // Replace with actual admin check logic

  if (!isAdmin) {
    redirect("/");
  }

  return (
    <>
      <CustomLink href="/admin/pizzas/new">Új pizza hozzáadása</CustomLink>
      <Suspense fallback={<div>Loading...</div>}>
        <AdminPizzaList />
      </Suspense>
    </>
  );
}
