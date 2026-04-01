"use client";

import ActionModal from "@/shared/Components/ActionModal";
import { toast } from "sonner";
import { useState } from "react";

type Props = {
  id: string;
  isAvailableOnMenu: boolean;
};

export default function ChangePastaMenuStateBtn({
  id,
  isAvailableOnMenu,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  async function changePastaMenu(id: string, isAvailableOnMenu: boolean) {
    try {
      setIsLoading(true);
      const response = await changePastaMenuAction(id, isAvailableOnMenu);
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
      action={() => changePizzaMenu(id, isAvailableOnMenu)}
      disabled={isLoading}
    />
  );
}
