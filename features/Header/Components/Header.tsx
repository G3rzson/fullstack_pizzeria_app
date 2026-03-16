import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import Logo from "./Logo";
import { isUserAdmin } from "@/lib/isUserAdmin";
import Link from "next/link";

export default function Header() {
  const isAdmin = isUserAdmin();
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
      </div>
    </header>
  );
}
