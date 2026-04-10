import { getAllAvailableDrinkAction } from "../_actions/getAllAvailableDrinkAction";
import ServerError from "@/shared/Components/ServerError";
import EmptyList from "@/shared/Components/EmptyList";
import MenuListItem from "@/shared/Components/MenuListItem";

export default async function DrinkList() {
  const response = await getAllAvailableDrinkAction();

  if (!response.success || !response.data)
    return (
      <ServerError
        errorMsg={response.message}
        path="/"
        title="Vissza a főoldalra"
      />
    );

  if (response.data.length === 0)
    return <EmptyList text="Jelenleg nincs elérhető ital!" />;

  return (
    <ul className="menu-grid">
      {response.data.map((drink) => (
        <MenuListItem key={drink.id} menuArray={drink} />
      ))}
    </ul>
  );
}
