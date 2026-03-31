"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function PizzaImageBtn({ pizzaId }: { pizzaId: string }) {
  const router = useRouter();

  function handleClick(pizzaId: string) {
    router.push(`/dashboard/pizzas/image/upload/${pizzaId}`);
  }

  return (
    <Button
      variant={"secondary"}
      onClick={() => handleClick(pizzaId)}
      className="cursor-pointer w-full"
    >
      Kép feltöltése
    </Button>
  );
}
