import { getOnePizzaByIdAction } from "@/actions/pizzaActions";
import PizzaForm from "@/components/Forms/PizzaForm";

export default async function Page({
  params,
}: {
  params: { "pizza-id": string };
}) {
  const pizzaId = (await params)["pizza-id"];
  const response = await getOnePizzaByIdAction(pizzaId);

  if (!response.success || !response.data) {
    return (
      <div className="flex flex-col grow items-center justify-center gap-8">
        <h1 className="text-center text-3xl">
          Hiba történt: {response.message}
        </h1>
      </div>
    );
  }

  const updatingPizzaObj = {
    id: response.data.id,
    pizzaName: response.data.pizzaName,
    pizzaPrice32: response.data.pizzaPrice32.toString(),
    pizzaPrice45: response.data.pizzaPrice45.toString(),
    pizzaDescription: response.data.pizzaDescription,
  };

  return (
    <div className="flex flex-col grow items-center justify-center gap-8">
      <h1 className="text-center text-3xl">Pizza frissítése</h1>
      <PizzaForm pizzaObj={updatingPizzaObj} />
    </div>
  );
}
