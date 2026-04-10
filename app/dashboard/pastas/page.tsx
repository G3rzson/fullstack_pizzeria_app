import Loading from "@/app/loading";
import { Suspense } from "react";
import PastaList from "./_components/PastaList";
import MenuNavLink from "@/shared/Components/MenuNavLink";

export const dynamic = "force-dynamic";

export default function DashboardPastasPage() {
  return (
    <div className="flex grow flex-col gap-4">
      <div className="flex flex-row justify-between my-4">
        <h1 className="page-title">Tészták</h1>

        <div className="w-fit">
          <MenuNavLink href="/dashboard/pastas/new" title="Tészta hozzáadása" />
        </div>
      </div>
      <Suspense fallback={<Loading />}>
        <PastaList />
      </Suspense>
    </div>
  );
}
