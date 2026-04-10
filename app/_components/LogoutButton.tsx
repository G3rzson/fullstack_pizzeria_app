"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/useAuth";

type Props = {
  onBeforeLogout?: () => void;
};

export function LogoutButton({ onBeforeLogout }: Props) {
  const router = useRouter();
  const { logout } = useAuth();

  async function handleLogout() {
    onBeforeLogout?.();

    try {
      const response = await fetch("/auth/logout", { method: "POST" });
      if (!response.ok) {
        console.error("Logout failed");
        toast.error("Hiba történt a kijelentkezés során");
        return;
      }

      const data = await response.json();
      toast.success(data.message);
      logout();
      router.push("/");
    } catch {
      console.error("Logout failed");
      toast.error("Hiba történt a kijelentkezés során");
    }
  }

  return (
    <Button
      variant="outline"
      type="button"
      className="w-full cursor-pointer"
      onClick={() => handleLogout()}
    >
      Kijelentkezés
    </Button>
  );
}
