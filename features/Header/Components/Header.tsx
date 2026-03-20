"use client";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import Logo from "./Logo";
import Link from "next/link";
import UserMenu from "@/features/User/Components/UserMenu";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

export default function Header() {
  const { permissions } = useKindeBrowserClient();

  const isAdmin = permissions?.permissions.includes("admin-user");

  return (
    <header className="w-full border-b bg-background sticky top-0 left-0 z-50">
      <div className="md:w-4/5 w-full mx-auto flex items-center justify-between px-4 py-3">
        <Logo />

        <Link href="/admin" className="text-h4">
          Admin
        </Link>

        <DesktopNav />

        <MobileNav />

        <UserMenu type="desktop" />
      </div>
    </header>
  );
}
