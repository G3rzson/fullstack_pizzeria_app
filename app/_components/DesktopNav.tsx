"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "../_constants/navLinks";
import { useAuth } from "@/lib/auth/useAuth";

export default function DesktopNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <ul className="hidden md:flex flex-row items-center justify-end gap-4">
      {NAV_LINKS.map((link) => {
        // Skip rendering the dashboard link in the desktop nav if user is not an admin
        if (link.href === "/dashboard" && user?.role !== "ADMIN") {
          return null;
        }

        return (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`
              ${
                pathname === link.href
                  ? "nav-link desktop active"
                  : "nav-link desktop"
              } text-2xl`}
            >
              {link.title}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
