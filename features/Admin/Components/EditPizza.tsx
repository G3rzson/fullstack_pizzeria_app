"use client";

import ActionModal from "../../../shared/Components/ActionModal";
import { useRouter } from "next/navigation";

type Props = {
  pizzaId: string;
};

export default function EditPizza({ pizzaId }: Props) {
  const router = useRouter();
  function editPizza(id: string) {
    router.push(`/admin/pizzas/edit/${id}`);
  }
  return (
    <>
      <ActionModal
        triggerTitle="Pizza szerkesztése"
        description="Biztos szerkeszteni szeretnéd a pizza adatait?"
        action={() => editPizza(pizzaId)}
      />
    </>
  );
}
