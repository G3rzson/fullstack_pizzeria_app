"use client";

import ActionModal from "@/shared/Components/ActionModal";
import { changeMenuAction } from "../_actions/changeMenuAction";
import { toast } from "sonner";

type Props = {
  pizzaId: string;
  isAvailableOnMenu: boolean;
};
export default function ChangeMenu({ pizzaId, isAvailableOnMenu }: Props) {
  async function changeMenu(pizzaId: string, isAvailableOnMenu: boolean) {
    const response = await changeMenuAction(pizzaId, isAvailableOnMenu);

    if (!response.success) {
      toast.error(
        response.message ||
          "Hiba történt az étlap státuszának megváltoztatása során.",
      );
      return;
    }
    toast.success(
      response.message || "Az étlap státusza sikeresen megváltozott.",
    );
  }
  return (
    <ActionModal
      triggerTitle={
        isAvailableOnMenu ? "Levétel az étlapról" : "Hozzáadás az étlaphoz"
      }
      description="Biztos módisítod az étlap státuszát?"
      action={() => changeMenu(pizzaId, isAvailableOnMenu)}
    />
  );
}
