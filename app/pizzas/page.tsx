import Link from "next/link";

export default function Page() {
  return (
    <div className="sm:w-4/5 w-full mx-auto relative">
      <h1 className="text-center text-3xl my-8">Pizzák</h1>
      <Link
        href="/pizzas/create"
        className="bg-amber-700 px-4 py-2 rounded absolute right-0 top-8"
      >
        Új pizza hozzáadása
      </Link>
    </div>
  );
}
