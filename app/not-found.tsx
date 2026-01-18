import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex grow items-center justify-center flex-col gap-8 px-4">
      <h1 className="text-3xl font-bold text-center">
        404 - Az oldal nem található
      </h1>
      <Link
        aria-label="Vissza a Főoldalra"
        href="/"
        className="dark:bg-red-900 bg-red-300 hover:bg-red-400 dark:hover:bg-red-800 duration-300 px-4 py-2 rounded"
      >
        ← Vissza a főoldalra
      </Link>
    </div>
  );
}
