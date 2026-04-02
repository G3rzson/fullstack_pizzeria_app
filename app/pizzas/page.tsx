import { Suspense } from "react";
import Loading from "../loading";
import PizzaList from "./_components/PizzaList";

export default function PizzaPage() {
  return (
    <div className="flex grow flex-col gap-4">
      <h1 className="text-4xl">Pizzák</h1>

      <Suspense fallback={<Loading />}>
        <PizzaList />
      </Suspense>
    </div>
  );
}
