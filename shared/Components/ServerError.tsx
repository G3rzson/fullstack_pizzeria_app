"use client";

import Link from "next/link";

type Props = {
  errorMsg: string;
  path: string;
  title: string;
};

export default function ServerError({ errorMsg, path, title }: Props) {
  return (
    <div>
      <h1>{errorMsg}</h1>
      <Link href={path} className="text-blue-500 underline">
        {title}
      </Link>
    </div>
  );
}
