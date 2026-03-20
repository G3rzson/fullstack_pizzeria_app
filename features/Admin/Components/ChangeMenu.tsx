"use client";
import { changeMenuAction } from "../Actions/changeMenuAction";
import ActionModal from "../../../shared/Components/ActionModal";

type Props = {
  pizzaId: string;
  isAvailableOnMenu: boolean;
};
export default function ChangeMenu({ pizzaId, isAvailableOnMenu }: Props) {
  async function changeMenu(pizzaId: string, isAvailableOnMenu: boolean) {
    const response = await changeMenuAction(pizzaId, isAvailableOnMenu);

    console.log(response);
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
