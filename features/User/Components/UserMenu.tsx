import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeSwitcher } from "@/features/ThemeSwicher/ThemeSwitcher";
import { User } from "lucide-react";
import Link from "next/link";
import LogoutBtn from "./LogoutBtn";

export default function UserMenu({
  type,
  isLoggedIn,
}: {
  type: "mobile" | "desktop";
  isLoggedIn?: boolean;
}) {
  const isMobile = type === "mobile";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <User className={isMobile ? "size-4" : "size-6"} />
          {isMobile ? "Felhasználó" : ""}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={isMobile ? "center" : "end"}
        className={`${isMobile ? "" : "w-fit"} min-w-56`}
      >
        <DropdownMenuGroup className="border-b">
          <DropdownMenuLabel className="pl-4">
            Felhasználói menü
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        {isLoggedIn ? (
          <LogoutBtn />
        ) : (
          <div className="flex flex-col m-2">
            <Link
              href="/user/login"
              className="hover:bg-current/20 w-full h-full p-2 rounded duration-300 text-center"
            >
              Bejelentkezés
            </Link>

            <Link
              href="/user/register"
              className="hover:bg-current/20 w-full h-full p-2 rounded duration-300 text-center"
            >
              Regisztráció
            </Link>
          </div>
        )}
        <DropdownMenuGroup className="border-b mb-1">
          <DropdownMenuLabel className="pl-4">
            Téma beállítások
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <ThemeSwitcher isMobile={isMobile} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
