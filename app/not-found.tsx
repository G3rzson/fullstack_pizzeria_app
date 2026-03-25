import { ArrowBigLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col grow items-center justify-center gap-8">
      <h1 className="text-4xl font-bold text-center">Page Not Found!</h1>

      <Link
        href="/"
        className="flex items-center bg-destructive/40 hover:bg-destructive/80 gap-2 rounded-md px-4 py-2 transition-colors duration-300"
      >
        <ArrowBigLeft /> Go to the home page
      </Link>
    </div>
  );
}
