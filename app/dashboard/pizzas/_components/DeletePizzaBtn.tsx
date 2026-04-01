"use client";

import ActionModal from "@/shared/Components/ActionModal";
import { toast } from "sonner";
import { useState } from "react";
import { deletePizzaAction } from "../_actions/deletePizzaAction";

export default function DeletePizzaBtn({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

  async function handleDelete(id: string) {
    try {
      setLoading(true);
      const response = await deletePizzaAction(id);
      if (!response.success) return toast.error(response.message);

      toast.success(response.message);
    } catch (error) {
      toast.error("Hiba történt a pizza törlése során!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ActionModal
      triggerTitle="Pizza törlése"
      description="Biztos törölni szeretnéd a pizzát az étlapról? Ez a művelet nem visszavonható!"
      action={() => handleDelete(id)}
      disabled={loading}
    />
  );
}
