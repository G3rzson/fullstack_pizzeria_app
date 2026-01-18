import Link from "next/link";

export default function Page() {
  return (
    <div className="sm:w-4/5 w-full mx-auto relative">
      <h1 className="text-center text-3xl my-8">Pizzák</h1>
      <Link
        href="/pizzas/create"
        className="dark:bg-blue-900 bg-blue-300 hover:bg-blue-400 dark:hover:bg-blue-800 duration-300 px-4 py-2 rounded absolute right-0 top-8"
      >
        Új pizza hozzáadása
      </Link>
    </div>
  );
}
