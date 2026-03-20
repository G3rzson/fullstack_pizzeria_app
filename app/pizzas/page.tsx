import PizzaList from "@/features/Pizzas/Components/PizzaList";
import { CustomSkeleton } from "@/shared/Components/CustomSkeleton";
import { Suspense } from "react";

export default async function PizzasPage() {
  return (
    <>
      <h1 className="page-title">Pizzák</h1>

      <Suspense fallback={<CustomSkeleton />}>
        <PizzaList />
      </Suspense>
    </>
  );
}
