import { Suspense } from "react";
import Loading from "../../loading";
import PastaList from "./_components/PastaList";

export const dynamic = "force-dynamic";

export default function PastaPage() {
  return (
    <div className="flex grow flex-col gap-4">
      <h1 className="page-title">Tészták</h1>

      <Suspense fallback={<Loading />}>
        <PastaList />
      </Suspense>
    </div>
  );
}
