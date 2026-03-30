import Link from "next/link";
import { Suspense } from "react";
import PizzaList from "./new/_components/PizzaList";

export default function DashboardPizzasPage() {
  return (
    <div className="flex grow flex-col gap-4">
      <div className="flex flex-row justify-between my-4">
        <h1 className="text-4xl">Pizzák</h1>

        <Link
          href="/dashboard/pizzas/new"
          className="hover:bg-current/10 rounded-md px-4 py-2 text-sm font-medium w-fit transition-colors duration-300"
        >
          Új pizza létrehozása
        </Link>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <PizzaList />
      </Suspense>
    </div>
  );
}
