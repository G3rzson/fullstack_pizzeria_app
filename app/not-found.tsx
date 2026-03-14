import { ArrowBigLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col grow items-center justify-center gap-8">
      <h1 className="text-4xl font-bold">Page Not Found!</h1>
      <Link
        className="flex items-center gap-4 text-link hover:text-link/80 transition-colors duration-300 hover:bg-link/10 rounded-md px-4 py-2"
        href={"/"}
      >
        <ArrowBigLeft /> Go to the home page
      </Link>
    </div>
  );
}
