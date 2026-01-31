"use client";
import { FilePen } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PizzaUpdateBtn({ pizzaId }: { pizzaId: string }) {
  const router = useRouter();
  function handleUpdate(id: string) {
    router.push(`/pizzas/update/${id}`);
  }
  return (
    <button
      type="button"
      onClick={() => handleUpdate(pizzaId)}
      className="cursor-pointer"
    >
      <FilePen
        size={24}
        className="text-orange-700 hover:text-orange-600 duration-300"
      />
    </button>
  );
}
