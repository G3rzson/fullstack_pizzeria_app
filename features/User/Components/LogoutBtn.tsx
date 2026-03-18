"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function LogoutBtn() {
  const router = useRouter();

  async function handleLogout() {
    const response = await fetch("/user/logout", { method: "POST" });
    console.log(response);
    router.push("/");
    router.refresh();
  }
  return (
    <Button
      variant={"ghost"}
      className="w-full cursor-pointer"
      onClick={handleLogout}
    >
      Kijelentkezés
    </Button>
  );
}
