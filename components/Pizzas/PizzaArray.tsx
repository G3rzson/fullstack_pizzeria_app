import { getAllPizzaAction } from "@/actions/pizzaActions";
import PizzaCard from "./PizzaCard";

export default async function PizzaArray() {
  const response = await getAllPizzaAction();
  if (!response.success) {
    return (
      <div className="flex grow items-center justify-center">
        Hiba a pizzák lekérése során!
      </div>
    );
  }

  const pizzaArray = response.data || [];

  if (pizzaArray.length === 0) {
    return (
      <div className="flex grow items-center justify-center">
        Jelenleg nincs elérhető pizza.
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {pizzaArray.map((pizza) => (
        <PizzaCard key={pizza.id} pizza={pizza} />
      ))}
    </ul>
  );
}
