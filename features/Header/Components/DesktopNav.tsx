"use client";
import { NAV_LINKS } from "../Constants/Constants";
import Link from "next/link";

export default function DesktopNav() {
  return (
    <nav className="hidden md:block">
      <ul className="flex gap-6">
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <Link className="text-2xl" href={link.href}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
