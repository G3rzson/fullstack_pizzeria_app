"use client";

import ActionModal from "@/shared/Components/ActionModal";
import { deletePizzaAction } from "../_actions/deletePizzaAction";
import { toast } from "sonner";

export default function DeletePizza({ pizzaId }: { pizzaId: string }) {
  async function deletePizza(pizzaId: string) {
    const response = await deletePizzaAction(pizzaId);

    if (!response.success) {
      toast.error(response.message || "Hiba történt a pizza törlése során!");
      return;
    }

    toast.success(response.message || "A pizza sikeresen törölve.");
  }
  return (
    <ActionModal
      triggerTitle="Pizza törlése"
      description="Biztos törölni szeretnéd a pizzát az étlapról? Ez a művelet nem visszavonható!"
      action={() => deletePizza(pizzaId)}
    />
  );
}
