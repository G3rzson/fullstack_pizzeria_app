"use client";
import { deletePizzaAction } from "@/actions/pizzaActions";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function PizzaDeleteBtn({ pizzaId }: { pizzaId: string }) {
  async function handleDelete(id: string) {
    const response = await deletePizzaAction(id);

    if (!response.success) {
      toast.error(response.message || "Error during pizza deletion!");
      return;
    }
    toast.success("Pizza deleted successfully!");
  }
  return (
    <button
      type="button"
      onClick={() => handleDelete(pizzaId)}
      className="w-full cursor-pointer flex justify-end"
    >
      <Trash2
        size={24}
        className="text-red-700 hover:text-red-600 duration-300"
      />
    </button>
  );
}
