import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import Logo from "./Logo";
import { isUserAdmin } from "@/lib/isUserAdmin";
import Link from "next/link";
import UserMenu from "@/features/User/Components/UserMenu";
import { getAuthUser } from "@/shared/auth/requireAuth";

export default async function Header() {
  const isAdmin = await isUserAdmin();
  const user = await getAuthUser();

  return (
    <header className="w-full border-b bg-background sticky top-0 left-0 z-50">
      <div className="md:w-4/5 w-full mx-auto flex items-center justify-between px-4 py-3">
        <Logo />

        {isAdmin && (
          <Link href="/admin" className="text-h4">
            Admin
          </Link>
        )}

        <DesktopNav />

        <MobileNav />

        <UserMenu type="desktop" isLoggedIn={!!user} />
      </div>
    </header>
  );
}
