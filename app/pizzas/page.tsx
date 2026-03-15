import CustomLink from "@/components/ui/CustomLink";
import PizzaList from "@/features/Pizzas/Components/PizzaList";
import { ArrowBigRight } from "lucide-react";
import { Suspense } from "react";

export default async function PizzasPage() {
  return (
    <>
      <h1 className="page-title">Pizzák</h1>

      <CustomLink href="/pizzas/new">
        Új pizza hozzáadása
        <ArrowBigRight />
      </CustomLink>

      <Suspense
        fallback={
          <p className="mt-4 text-center text-muted-foreground">
            Pizzák betöltése...
          </p>
        }
      >
        <PizzaList />
      </Suspense>
    </>
  );
}
