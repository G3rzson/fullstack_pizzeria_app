import { getAllDrinkAction } from "../_actions/getAllDrinkAction";
import ServerError from "@/shared/Components/ServerError";
import DrinkListItem from "./DrinkListItem";

export default async function DrinkList() {
  const response = await getAllDrinkAction();

  if (!response.success || !response.data)
    return (
      <ServerError
        errorMsg={response.message}
        path="/dashboard"
        title="Vissza a dashboardra"
      />
    );

  if (response.data.length === 0)
    return <div>Jelenleg nincs elérhető ital.</div>;

  return (
    <ul className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
      {response.data.map((drink) => (
        <DrinkListItem key={drink.id} drink={drink} />
      ))}
    </ul>
  );
}
