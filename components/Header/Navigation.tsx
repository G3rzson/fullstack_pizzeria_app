"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import HamburgerMenuBtn from "./HamburgerMenuBtn";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/pizzas", label: "Pizzák" },
  { href: "/about", label: "Rólunk" },
  { href: "/contact", label: "Kapcsolat" },
  { href: "/user/register", label: "Regisztráció" },
  { href: "/user/login", label: "Bejelentkezés" },
];

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

      {/* Navigation */}
      <nav
        id="nav-panel"
        className="absolute left-0 top-full w-full sm:static sm:w-auto dark:bg-zinc-800 dark:text-zinc-200 bg-zinc-200 text-zinc-800 z-50 border-b border-zinc-500 sm:border-none"
      >
        <ul
          className={`flex flex-col sm:flex-row items-center justify-center sm:justify-end overflow-hidden max-h-0 opacity-0 transition-[max-height,opacity] duration-300 ease-in-out sm:transition-none sm:max-h-none sm:opacity-100 sm:overflow-visible
      ${isMenuOpen ? "max-h-96 opacity-100" : ""}`}
        >
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  className={`${isActive ? "text-amber-500" : "text-zinc-800 dark:text-zinc-200"} hover:text-amber-500 duration-300 block p-4`}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
