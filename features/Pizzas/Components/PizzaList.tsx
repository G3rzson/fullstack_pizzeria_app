import { getAllPizzaAction } from "../Actions/getAllPizza.action";
import { getAllAvailablePizzaAction } from "../Actions/getAllAvailablePizza.action";
import PizzaCard from "./PizzaCard";

export default async function PizzaList() {
  const isAdmin = true;

  const response = isAdmin
    ? await getAllPizzaAction()
    : await getAllAvailablePizzaAction();

  if (!response.success) {
    return <p>Hiba történt a pizzák lekérése során.</p>;
  }

  const pizzasArray = response.data || [];

  return (
    <>
      {pizzasArray.length === 0 ? (
        <p className="mt-4 text-center text-muted-foreground">
          Nincsenek pizzák a rendszerben. Kattints a fenti gombra egy új pizza
          hozzáadásához.
        </p>
      ) : (
        <ul
          id="pizza-list"
          className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 overflow-auto"
        >
          {pizzasArray.map((pizza) => (
            <PizzaCard key={pizza.id} pizza={pizza} isAdmin={isAdmin} />
          ))}
        </ul>
      )}
    </>
  );
}
