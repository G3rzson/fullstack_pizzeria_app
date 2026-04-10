import { getAllPastaAction } from "../_actions/getAllPastaAction";
import ServerError from "@/shared/Components/ServerError";
import EmptyList from "@/shared/Components/EmptyList";
import PastaListItem from "./PastaListItem";

export default async function PastaList() {
  const response = await getAllPastaAction();

  if (!response.success || !response.data)
    return (
      <ServerError
        errorMsg={response.message}
        path="/dashboard"
        title="Vissza a főoldalra"
      />
    );

  if (response.data.length === 0)
    return <EmptyList text="Jelenleg nincs elérhető tészta!" />;

  return (
    <ul className="menu-grid">
      {response.data.map((pasta) => (
        <PastaListItem key={pasta.id} pasta={pasta} />
      ))}
    </ul>
  );
}
