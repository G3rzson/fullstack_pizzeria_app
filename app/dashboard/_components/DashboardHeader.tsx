"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DASHBOARD_NAV_LINKS } from "../_constants/deshboardNavLinks";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";

export default function DashboardHeader() {
  const pathname = usePathname();
  return (
    <>
      {/* Desktop Nav*/}
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

      {/* Mobile Nav */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="capitalize md:hidden w-fit ml-auto"
          >
            <Menu />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="p-0">
          <ul>
            {DASHBOARD_NAV_LINKS.map((link) => (
              <li key={link.href} className="w-full overflow-hidden">
                <DropdownMenuItem asChild>
                  <Link
                    className={`${pathname === link.href ? "active" : ""} nav-link mobile text-xl text-center p-4 block! w-full`}
                    href={link.href}
                  >
                    {link.title}
                  </Link>
                </DropdownMenuItem>
              </li>
            ))}
          </ul>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
