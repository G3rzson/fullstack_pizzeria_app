"use client";

import ActionModal from "@/shared/Components/ActionModal";
import { toast } from "sonner";
import { useState } from "react";
import { changeDrinkMenuAction } from "../_actions/changeDrinkMenuAction";

type Props = {
  id: string;
  isAvailableOnMenu: boolean;
};

export default function ChangeDrinkMenuStateBtn({
  id,
  isAvailableOnMenu,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  async function changeDrinkMenu(id: string, isAvailableOnMenu: boolean) {
    try {
      setIsLoading(true);
      const response = await changeDrinkMenuAction(id, isAvailableOnMenu);
      if (!response.success) {
        toast.error(response.message);
        return;
      }
      toast.success(response.message);
    } catch (error) {
      toast.error("Hiba történt a menü státuszának megváltoztatása során.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ActionModal
      triggerTitle={
        isAvailableOnMenu ? "Levétel a menüről" : "Hozzáadás a menühöz"
      }
      description="Biztos módisítod a menü státuszát?"
      action={() => changeDrinkMenu(id, isAvailableOnMenu)}
      disabled={isLoading}
    />
  );
}
