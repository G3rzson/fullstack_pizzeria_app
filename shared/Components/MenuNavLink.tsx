import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = { href: string; title: string };

export default function MenuNavLink({ href, title }: Props) {
  return (
    <Button asChild variant="outline" className="w-full cursor-pointer">
      <Link href={href}>{title}</Link>
    </Button>
  );
}
