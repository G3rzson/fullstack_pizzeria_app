import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
        <DropdownMenuItem
          asChild
          className="p-2 hover:bg-accent transition-colors duration-300 rounded"
        >
          <Link href="/auth/login">Bejelentkezés</Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          asChild
          className="p-2 hover:bg-accent transition-colors duration-300 rounded"
        >
          <Link href="/auth/register">Regisztráció</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
