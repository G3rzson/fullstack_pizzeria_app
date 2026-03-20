"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeSwitcher } from "@/features/ThemeSwicher/ThemeSwitcher";
import { User } from "lucide-react";
import {
  LoginLink,
  LogoutLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/server";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

export default function UserMenu({ type }: { type: "mobile" | "desktop" }) {
  const isMobile = type === "mobile";
  const { user } = useKindeBrowserClient();

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
        <DropdownMenuGroup>
          <DropdownMenuLabel>Felhasználói menü</DropdownMenuLabel>
          {user ? (
            <>
              <DropdownMenuItem asChild>
                <LogoutLink>Kijelentkezés</LogoutLink>
              </DropdownMenuItem>
              <p className="text-center">{user.given_name}</p>
            </>
          ) : (
            <>
              <DropdownMenuItem asChild>
                <LoginLink>Bejelentkezés</LoginLink>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <RegisterLink>Regisztráció</RegisterLink>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Téma beállítások</DropdownMenuLabel>
        </DropdownMenuGroup>
        <ThemeSwitcher isMobile={isMobile} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
