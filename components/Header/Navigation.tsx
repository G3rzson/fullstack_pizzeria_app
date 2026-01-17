"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import HamburgerMenuBtn from "./HamburgerMenuBtn";
import NavLinks from "./NavLinks";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close the menu when the route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Hamburger Menu */}
      <HamburgerMenuBtn isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      {/* Navigation Links */}
      <NavLinks isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
    </>
  );
}
