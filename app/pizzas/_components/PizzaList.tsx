import { getAllAvailablePizzaAction } from "../_actions/getAllAvailablePizzaAction";
import PizzaCard from "./PizzaCard";

export default async function PizzaList() {
  const response = await getAllAvailablePizzaAction();

  if (!response.success)
    return (
      <div>Hiba történt a pizzák lekérése során! Próbáld újra később.</div>
    );

  const pizzasArray = response.data || [];

  if (pizzasArray.length === 0)
    return <div>Jelenleg nincs elérhető pizza.</div>;

  return (
    <ul className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
      {pizzasArray.map((pizza) => (
        <li key={pizza.id}>
          <PizzaCard pizza={pizza} />
        </li>
      ))}
    </ul>
  );
}
