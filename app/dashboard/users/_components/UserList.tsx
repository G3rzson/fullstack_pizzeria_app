import ServerError from "@/shared/Components/ServerError";
import { getAllUserAction } from "../_actions/getAllUserAction";
import EmptyList from "@/shared/Components/EmptyList";
import UserListItem from "./UserListItem";

export default async function UserList() {
  const response = await getAllUserAction();

  if (!response.success || !response.data)
    return (
      <ServerError
        errorMsg={response.message}
        path="/dashboard"
        title="Vissza a dashboardra"
      />
    );

  if (response.data.length === 0)
    return <EmptyList text="Jelenleg nincs elérhető felhasználó!" />;

  return (
    <ul className="menu-grid">
      {response.data.map((user) => (
        <UserListItem key={user.id} userArray={user} />
      ))}
    </ul>
  );
}
