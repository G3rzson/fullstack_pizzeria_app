"use client";

import { useAuth } from "@/lib/auth/useAuth";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LogoutButton } from "./LogoutButton";

type Props = {
  onLogoutClick?: () => void;
};

export function UserMenuAuthenticatedState({ onLogoutClick }: Props) {
  const { user } = useAuth();

  return (
    <>
      <p className="text-center p-4 rounded-full bg-current/20 w-10 h-10 flex items-center justify-center mx-auto my-2">
        {user && user.username.charAt(0).toUpperCase()}
      </p>
      <p className="text-center mb-2">{user && user.username}</p>
      <DropdownMenuItem asChild>
        <LogoutButton onBeforeLogout={onLogoutClick} />
      </DropdownMenuItem>
    </>
  );
}
