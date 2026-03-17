import CustomLink from "@/components/ui/CustomLink";
import AdminPizzaList from "@/features/Admin/Components/AdminPizzaList";
import { AdminPizzaSkeleton } from "@/features/Admin/Components/AdminPizzaSkeleton";
import { Suspense } from "react";

export default function AdminPage() {
  return (
    <>
      <CustomLink href="/admin/pizzas/new">Új pizza hozzáadása</CustomLink>
      <Suspense fallback={<AdminPizzaSkeleton />}>
        <AdminPizzaList />
      </Suspense>
    </>
  );
}
