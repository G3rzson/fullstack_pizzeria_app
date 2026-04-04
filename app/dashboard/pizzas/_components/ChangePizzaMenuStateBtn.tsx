"use client";

import ActionModal from "@/shared/Components/ActionModal";
import { toast } from "sonner";
import { useState } from "react";
import { changePizzaMenuAction } from "../_actions/changePizzaMenuAction";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";

type Props = {
  id: string;
  isAvailableOnMenu: boolean;
};

export default function ChangePizzaMenuStateBtn({
  id,
  isAvailableOnMenu,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  async function changePizzaMenu(id: string, isAvailableOnMenu: boolean) {
    try {
      setIsLoading(true);
      const response = await changePizzaMenuAction(id, isAvailableOnMenu);
      if (!response.success) {
        toast.error(response.message);
        return;
      }
      toast.success(response.message);
    } catch (error) {
      toast.error(BACKEND_RESPONSE_MESSAGES.SERVER_ERROR);
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
