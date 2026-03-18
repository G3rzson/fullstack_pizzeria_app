import Link from "next/link";

export default function CustomLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      className="flex items-center gap-4 w-fit mx-auto text-link hover:text-link/80 transition-colors duration-300 hover:bg-link/10 rounded-md px-4 py-2"
      href={href}
    >
      {children}
    </Link>
  );
}
