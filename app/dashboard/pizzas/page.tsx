import { Suspense } from "react";
import Loading from "@/app/loading";
import PizzaList from "./_components/PizzaList";
import MenuNavLink from "@/shared/Components/MenuNavLink";

export const dynamic = "force-dynamic";

export default function DashboardPizzasPage() {
  return (
    <div className="flex grow flex-col gap-4">
      <div className="flex flex-row justify-between my-4">
        <h1 className="page-title">Pizzák</h1>

        <div className="w-fit">
          <MenuNavLink href="/dashboard/pizzas/new" title="Pizza hozzáadása" />
        </div>
      </div>
      <Suspense fallback={<Loading />}>
        <PizzaList />
      </Suspense>
    </div>
  );
}
