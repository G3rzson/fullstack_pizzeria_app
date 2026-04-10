"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import ActionModal from "@/shared/Components/ActionModal";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";
import { AdminUserDtoType } from "@/shared/Types/types";
import { useAuth } from "@/lib/auth/useAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { deleteUserAction } from "../_actions/deleteUserAction";
import { Badge } from "@/components/ui/badge";

export default function UserListItem({
  userArray,
}: {
  userArray: AdminUserDtoType;
}) {
  const router = useRouter();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);

  async function handleDelete(id: string) {
    try {
      setLoading(true);
      const response = await deleteUserAction(id);
      if (!response.success) {
        toast.error(response.message);
        return;
      }

      const isSelfDelete =
        "data" in response &&
        !!response.data &&
        typeof response.data === "object" &&
        "isSelfDelete" in response.data &&
        (response.data as { isSelfDelete?: boolean }).isSelfDelete === true;

      if (isSelfDelete) {
        logout();
        router.push("/");
      } else {
        router.refresh();
      }

      toast.success(response.message);
    } catch (error) {
      toast.error(BACKEND_RESPONSE_MESSAGES.SERVER_ERROR);
    } finally {
      setLoading(false);
    }
  }

  return (
    <li>
      <Card className="h-full w-full flex flex-col">
        <div className="flex flex-row items-start justify-between gap-4 flex-1">
          <CardContent className="space-y-2 h-full flex flex-col">
            <h3 className="text-lg font-semibold">{userArray.username}</h3>
            <p className="text-sm">{userArray.email}</p>
            <p className="text-sm">{userArray.role}</p>
            <Badge
              className={`${userArray.isStillWorkingHere ? "bg-green-500/20" : "bg-destructive/20"} mt-auto rounded-full text-foreground w-fit`}
            >
              {userArray.isStillWorkingHere ? "Dolgozó" : "Vendég"}
            </Badge>
          </CardContent>

          {userArray.orderAddress && (
            <CardContent className="space-y-2 text-right">
              <p className="text-sm">{userArray.orderAddress.fullName}</p>
              <p className="text-sm">{userArray.orderAddress.phoneNumber}</p>
              <p className="text-sm">{userArray.orderAddress.postalCode}</p>
              <p className="text-sm">{userArray.orderAddress.city}</p>

              <div className="flex flex-row items-center justify-end gap-2">
                <p className="text-sm">{userArray.orderAddress.street}</p>
                <p className="text-sm">{userArray.orderAddress.houseNumber}</p>
                {userArray.orderAddress.floorAndDoor && (
                  <p className="text-sm">
                    {userArray.orderAddress.floorAndDoor}
                  </p>
                )}
              </div>
            </CardContent>
          )}
        </div>
        <CardFooter className="mt-auto">
          <ActionModal
            triggerTitle="Felhasználó törlése!"
            description="Biztosan törölni szeretnéd ezt a felhasználót? Ez a művelet nem visszavonható!"
            action={() => handleDelete(userArray.id)}
            disabled={loading}
          />
        </CardFooter>
      </Card>
    </li>
  );
}
