import ServerError from "@/shared/Components/ServerError";
import { getAllAvailablePizzaAction } from "../_actions/getAllAvailablePizzaAction";
import EmptyList from "@/shared/Components/EmptyList";
import MenuListItem from "@/shared/Components/MenuListItem";

export default async function PizzaList() {
  const response = await getAllAvailablePizzaAction();

  if (!response.success || !response.data)
    return (
      <ServerError
        errorMsg={response.message}
        path="/"
        title="Vissza a főoldalra"
      />
    );

  if (response.data.length === 0)
    return <EmptyList text="Jelenleg nincs elérhető pizza!" />;

  return (
    <ul className="menu-grid">
      {response.data.map((pizza) => (
        <MenuListItem key={pizza.id} menuArray={pizza} />
      ))}
    </ul>
  );
}
