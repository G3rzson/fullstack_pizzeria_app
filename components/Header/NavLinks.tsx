"use client";

import Link from "next/link";
import type { Dispatch, SetStateAction } from "react";

const NAV_LINKS = [
  { href: "/pizzas", label: "Pizzák" },
  { href: "/about", label: "Rólunk" },
  { href: "/contact", label: "Kapcsolat" },
];

type Props = {
  isMenuOpen: boolean;
  setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
};

export default function NavLinks({ isMenuOpen, setIsMenuOpen }: Props) {
  return (
    <nav id="nav-panel">
      <ul
        className={`flex flex-col sm:flex-row items-center justify-center sm:justify-end overflow-hidden max-h-0 opacity-0 transition-[max-height,opacity] duration-300 ease-in-out sm:transition-none sm:max-h-none sm:opacity-100 sm:overflow-visible
      ${isMenuOpen ? "max-h-96 opacity-100" : ""}`}
      >
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <Link
              className="block p-4"
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
