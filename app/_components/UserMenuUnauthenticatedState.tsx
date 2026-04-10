import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import Link from "next/link";

export function UserMenuUnauthenticatedState() {
  return (
    <>
      <DropdownMenuItem asChild>
        <Button asChild variant="outline" className="w-full cursor-pointer">
          <Link href="/auth/login">Bejelentkezés</Link>
        </Button>
      </DropdownMenuItem>

      <DropdownMenuItem asChild>
        <Button asChild variant="outline" className="w-full cursor-pointer">
          <Link href="/auth/register">Regisztráció</Link>
        </Button>
      </DropdownMenuItem>
    </>
  );
}
