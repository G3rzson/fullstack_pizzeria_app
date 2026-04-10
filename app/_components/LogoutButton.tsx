"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/useAuth";
import { useCart } from "@/lib/cart/useCart";
import { clearLocalStorage } from "@/lib/localStorage/localStorage";

type Props = {
  onBeforeLogout?: () => void;
};

export function LogoutButton({ onBeforeLogout }: Props) {
  const router = useRouter();
  const { logout } = useAuth();
  const { setCartItems } = useCart();

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
      clearLocalStorage();
      setCartItems([]);
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
