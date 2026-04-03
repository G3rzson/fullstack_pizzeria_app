"use client";

import { ArrowBigLeft } from "lucide-react";
import Link from "next/link";

type Props = {
  errorMsg: string;
  path: string;
  title: string;
};

export default function ServerError({ errorMsg, path, title }: Props) {
  return (
    <div className="centered-container flex-col gap-6">
      <p className="text-destructive text-xl sm:text-3xl text-center">
        {errorMsg}
      </p>
      <Link
        href={path}
        className="flex items-center bg-destructive/30 hover:bg-destructive/40 gap-2 rounded-md px-4 py-2 transition-colors duration-300"
      >
        <ArrowBigLeft /> {title}
      </Link>
    </div>
  );
}
