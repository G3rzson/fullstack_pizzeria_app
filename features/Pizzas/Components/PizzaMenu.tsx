"use client";
import { Button } from "@/components/ui/button";
import { PizzaGetType } from "../Dal/pizza.dal";
import { changeMenuAction } from "../Actions/changeMenu.action";

export default function PizzaMenu({ pizza }: { pizza: PizzaGetType }) {
  async function changeMenu(pizzaId: string) {
    const response = await changeMenuAction(pizzaId, !pizza.isAvailableOnMenu);

    console.log(response);
  }
  return (
    <div className="absolute top-2 right-2 flex flex-col z-30 w-50">
      <Button variant={"secondary"} className="cursor-pointer">
        Szerkesztés
      </Button>

      <Button variant={"secondary"} className="cursor-pointer">
        Törlés
      </Button>

      <Button
        variant={"secondary"}
        className="cursor-pointer"
        onClick={() => changeMenu(pizza.id)}
      >
        {pizza.isAvailableOnMenu
          ? "Levétel az étlapról"
          : "Hozzáadás az étlaphoz"}
      </Button>
    </div>
  );
}
