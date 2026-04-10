import { Suspense } from "react";
import Loading from "@/app/loading";
import UserList from "./_components/UserList";

export default async function UsersPage() {
  return (
    <div className="flex grow flex-col gap-4">
      <h1 className="page-title mt-4">Felhasználók</h1>

      <Suspense fallback={<Loading />}>
        <UserList />
      </Suspense>
    </div>
  );
}
