"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import { useAuth } from "@/lib/auth/useAuth";
import { UserMenuLoadingState } from "./UserMenuLoadingState";
import { UserMenuUnauthenticatedState } from "./UserMenuUnauthenticatedState";
import { UserMenuAuthenticatedState } from "./UserMenuAuthenticatedState";

export default function UserMenu() {
  const { user, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="cursor-pointer"
          title="Felhasználói menü"
          aria-label="Felhasználói menü"
        >
          <User />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 space-y-2">
        {isLoading ? (
          <UserMenuLoadingState />
        ) : user ? (
          <>
            <UserMenuAuthenticatedState
              onLogoutClick={() => setIsOpen(false)}
            />
          </>
        ) : (
          <UserMenuUnauthenticatedState />
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
