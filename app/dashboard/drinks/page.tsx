import Loading from "@/app/loading";
import { Suspense } from "react";
import DrinkList from "./_components/DrinkList";
import MenuNavLink from "@/shared/Components/MenuNavLink";

export default function DashboardDrinksPage() {
  return (
    <div className="flex grow flex-col gap-4">
      <div className="flex flex-row justify-between my-4">
        <h1 className="page-title">Italok</h1>

        <div className="w-fit">
          <MenuNavLink href="/dashboard/drinks/new" title="Ital hozzáadása" />
        </div>
      </div>
      <Suspense fallback={<Loading />}>
        <DrinkList />
      </Suspense>
    </div>
  );
}
