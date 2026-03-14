import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import Logo from "./Logo";

export default function Header() {
  return (
    <header className="w-full border-b bg-background sticky top-0 left-0 z-50">
      <div className="md:w-4/5 w-full mx-auto flex items-center justify-between px-4 py-3">
        <Logo />

        <DesktopNav />

        <MobileNav />
      </div>
    </header>
  );
}
