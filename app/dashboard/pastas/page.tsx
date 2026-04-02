import Loading from "@/app/loading";
import Link from "next/link";
import { Suspense } from "react";
import PastaList from "./_components/PastaList";

export default function DashboardPastasPage() {
  return (
    <div className="flex grow flex-col gap-4">
      <div className="flex flex-row justify-between my-4">
        <h1 className="text-4xl">Tészták</h1>

        <Link
          href="/dashboard/pastas/new"
          className="hover:bg-current/10 rounded-md px-4 py-2 text-sm font-medium w-fit transition-colors duration-300"
        >
          Tészta hozzáadása
        </Link>
      </div>
      <Suspense fallback={<Loading />}>
        <PastaList />
      </Suspense>
    </div>
  );
}
