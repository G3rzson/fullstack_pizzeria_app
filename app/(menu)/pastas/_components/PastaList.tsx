import { getAllAvailablePastaAction } from "../_actions/getAllAvailablePastaAction";
import ServerError from "@/shared/Components/ServerError";
import EmptyList from "@/shared/Components/EmptyList";
import MenuListItem from "@/shared/Components/MenuListItem";

export default async function PastaList() {
  const response = await getAllAvailablePastaAction();

  if (!response.success || !response.data)
    return (
      <ServerError
        errorMsg={response.message}
        path="/"
        title="Vissza a főoldalra"
      />
    );

  if (response.data.length === 0)
    return <EmptyList text="Jelenleg nincs elérhető tészta!" />;

  return (
    <ul className="menu-grid">
      {response.data.map((pasta) => (
        <MenuListItem key={pasta.id} menuArray={pasta} />
      ))}
    </ul>
  );
}
