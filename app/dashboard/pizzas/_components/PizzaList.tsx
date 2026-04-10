import { getAllPizzaAction } from "../_actions/getAllPizzaAction";
import ServerError from "@/shared/Components/ServerError";
import EmptyList from "@/shared/Components/EmptyList";
import PizzaListItem from "./PizzaListItem";

export default async function PizzaList() {
  const response = await getAllPizzaAction();

  if (!response.success || !response.data)
    return (
      <ServerError
        errorMsg={response.message}
        path="/dashboard"
        title="Vissza a dashboardra"
      />
    );

  if (response.data.length === 0)
    return <EmptyList text="Jelenleg nincs elérhető pizza!" />;

  return (
    <ul className="menu-grid">
      {response.data.map((pizza) => (
        <PizzaListItem key={pizza.id} pizza={pizza} />
      ))}
    </ul>
  );
}
