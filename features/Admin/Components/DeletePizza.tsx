"use client";

import { deletePizzaAction } from "../Actions/deletePizzaAction";
import ActionModal from "../../../shared/Components/ActionModal";

type Props = {
  pizzaId: string;
};

export default function DeletePizza({ pizzaId }: Props) {
  async function deletePizza(pizzaId: string) {
    const response = await deletePizzaAction(pizzaId);

    console.log(response);
  }
  return (
    <ActionModal
      triggerTitle="Pizza törlése"
      description="Biztos törölni szeretnéd a pizzát az étlapról? Ez a művelet nem visszavonható!"
      action={() => deletePizza(pizzaId)}
    />
  );
}
