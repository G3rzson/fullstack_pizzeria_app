import ServerError from "@/shared/Components/ServerError";
import { getPizzaByIdAction } from "../../_actions/getPizzaByIdAction";
import PizzaForm from "../../_components/PizzaForm";

export default async function EditPizzaPage({
  params,
}: {
  params: Promise<{ pizzaId: string }>;
}) {
  const pizzaId = (await params).pizzaId;

  const response = await getPizzaByIdAction(pizzaId);

  if (!response.success || !response.data) {
    return (
      <ServerError
        errorMsg={response.message}
        path="/dashboard/pizzas"
        title="Vissza a pizzákhoz"
      />
    );
  }

  return (
    <div className="flex grow items-center justify-center">
      <PizzaForm pizzaObject={response.data} />
    </div>
  );
}
