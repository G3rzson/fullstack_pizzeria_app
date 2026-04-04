import { Suspense } from "react";
import Loading from "../loading";
import DrinkList from "./_components/DrinkList";

export default function DrinkPage() {
  return (
    <div className="flex grow flex-col gap-4">
      <h1 className="page-title">Italok</h1>

      <Suspense fallback={<Loading />}>
        <DrinkList />
      </Suspense>
    </div>
  );
}
