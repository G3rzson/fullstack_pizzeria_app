"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DASHBOARD_NAV_LINKS } from "../_constants/deshboardNavLinks";

export default function DashboardDesktopNav() {
  const pathname = usePathname();
  return (
    <ul className="hidden md:flex flex-row items-center justify-center">
      {DASHBOARD_NAV_LINKS.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className={`
              ${
                pathname === link.href
                  ? "nav-link desktop active bg-secondary"
                  : "nav-link desktop"
              } p-4 text-xl hover:bg-secondary transition-colors duration-300`}
          >
            {link.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
