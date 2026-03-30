import Link from "next/link";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import { ThemeSwitcher } from "./ThemeSwitcher";
import Image from "next/image";
import UserMenu from "./UserMenu";

export default function Header() {
  return (
    <header className="w-full px-4 md:px-0 border-b-3 backdrop-blur-lg sticky top-0 left-0 z-50">
      <nav className="flex items-center justify-end gap-4 md:w-4/5 w-full mx-auto">
        <Link href="/" className="mr-auto">
          <Image
            src="/logo.png"
            alt="Logo"
            width={100}
            height={100}
            className="w-25 h-25 object-contain"
            loading="eager"
          />
        </Link>
        <DesktopNav />
        <MobileNav />
        <UserMenu />
        <ThemeSwitcher />
      </nav>
    </header>
  );
}
