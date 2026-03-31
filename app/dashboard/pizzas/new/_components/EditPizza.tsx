"use client";

import ActionModal from "@/shared/Components/ActionModal";
import { useRouter } from "next/navigation";

export default function EditPizza({ pizzaId }: { pizzaId: string }) {
  const router = useRouter();
  function editPizza(id: string) {
    router.push(`/dashboard/pizzas/edit/${id}`);
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
