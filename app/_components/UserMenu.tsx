import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import Link from "next/link";

export default function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" title="Téma kiválasztása">
          <User />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 p-2">
        <Link
          href="/auth/login"
          className="block p-2 text-center hover:bg-accent transition-colors duration-300 rounded"
        >
          Bejelentkezés
        </Link>
        <Link
          href="/auth/register"
          className="block p-2 text-center hover:bg-accent transition-colors duration-300 rounded"
        >
          Regisztráció
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
