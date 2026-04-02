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

export default function DashboardMobileNav() {
  const pathname = usePathname();
  return (
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
  );
}
