"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Loading from "../loading";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth/useAuth";

export default function UserMenu() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();

  async function handleLogout() {
    const response = await fetch("/auth/logout", { method: "POST" });
    if (!response.ok) {
      console.error("Logout failed");
      toast.error("Hiba történt a kijelentkezés során");
      return;
    }

    const data = await response.json();
    toast.success(data.message || "Sikeres kijelentkezés");
    logout();
    router.push("/");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" title="Téma kiválasztása">
          <User />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 p-2">
        {isLoading ? (
          <div className="w-40 h-20 flex items-center justify-center">
            <Loading />
          </div>
        ) : user ? (
          <>
            <DropdownMenuItem asChild></DropdownMenuItem>
            <p className="text-center p-4 rounded-full bg-current/20 w-10 h-10 flex items-center justify-center mx-auto my-2">
              {user.username.charAt(0).toUpperCase()}
            </p>
            <p className="text-center mb-2">{user.username}</p>
            <Button
              variant={"ghost"}
              className="w-full"
              onClick={() => handleLogout()}
            >
              Kijelentkezés
            </Button>
          </>
        ) : (
          <>
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
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
