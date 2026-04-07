import ServerError from "@/shared/Components/ServerError";
import { getAllUserAction } from "../_actions/getAllUserAction";
import EmptyList from "@/shared/Components/EmptyList";
import { Card, CardContent } from "@/components/ui/card";

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
        <li key={user.id}>
          <Card className="h-full w-full">
            <CardContent className="space-y-2">
              <h3 className="text-lg font-semibold">{user.username}</h3>
              <p className="text-sm">{user.email}</p>
              <p className="text-sm">{user.role}</p>
              {user.orderAddress && (
                <div className="space-y-1">
                  <p className="text-sm">{user.orderAddress.fullName}</p>
                  <p className="text-sm">{user.orderAddress.phoneNumber}</p>
                  <p className="text-sm">{user.orderAddress.postalCode}</p>
                  <p className="text-sm">{user.orderAddress.city}</p>
                  <p className="text-sm">{user.orderAddress.street}</p>
                  <p className="text-sm">{user.orderAddress.houseNumber}</p>
                  <p className="text-sm">{user.orderAddress.floorAndDoor}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}
