import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = { href: string; title: string };

export default function MenuNavLink({ href, title }: Props) {
  return (
    <Link href={href} className="w-full">
      <Button variant="secondary" className="w-full">
        {title}
      </Button>
    </Link>
  );
}
