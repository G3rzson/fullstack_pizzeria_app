"use client";
import { BackendPizzaType } from "@/features/Pizzas/Types/types";
import { Card } from "@/components/ui/card";
import ActionModal from "./ActionModal";
import { deletePizzaAction } from "../Actions/deletePizzaAction";
import { changeMenuAction } from "../Actions/changeMenu.action";
import { useRouter } from "next/navigation";

export default function PizzaMenu({ pizza }: { pizza: BackendPizzaType }) {
  async function deletePizza(pizzaId: string, publicId: string | null) {
    const response = await deletePizzaAction(pizzaId, publicId);

    console.log(response);
  }

  async function changeMenu(pizzaId: string, isAvailableOnMenu: boolean) {
    const response = await changeMenuAction(pizzaId, !isAvailableOnMenu);

    console.log(response);
  }

  const router = useRouter();
  function editPizza(id: string) {
    router.push(`/admin/pizzas/edit/${id}`);
  }
  return (
    <Card className="absolute top-2 right-2 flex flex-col gap-2 p-2 z-30 w-50">
      <ActionModal
        triggerTitle="Pizza szerkesztése"
        description="Biztos szerkeszteni szeretnéd a pizza adatait?"
        action={() => editPizza(pizza.id)}
      />

      <ActionModal
        triggerTitle="Pizza törlése"
        description="Biztos törölni szeretnéd a pizzát az étlapról? Ez a művelet nem visszavonható!"
        action={() => deletePizza(pizza.id, pizza.publicId)}
      />

      <ActionModal
        triggerTitle={
          pizza.isAvailableOnMenu
            ? "Levétel az étlapról"
            : "Hozzáadás az étlaphoz"
        }
        description="Biztos módisítod az étlap státuszát?"
        action={() => changeMenu(pizza.id, pizza.isAvailableOnMenu)}
      />
    </Card>
  );
}
