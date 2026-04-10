"use client";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "../_constants/navLinks";
import { useAuth } from "@/lib/auth/useAuth";

export default function MobileNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <Button
          aria-label="Open menu"
          variant="outline"
          className="capitalize md:hidden"
          onClick={(e) => e.currentTarget.blur()}
        >
          <Menu />
        </Button>
      </DrawerTrigger>
      <DrawerContent
        autoFocus
        className="data-[vaul-drawer-direction=bottom]:max-h-[50vh] data-[vaul-drawer-direction=top]:max-h-[50vh] flex flex-col h-full"
      >
        <DrawerHeader className="p-0 flex flex-col flex-1 min-h-0">
          <DrawerClose asChild>
            <Link href="/" className="mr-auto ml-4">
              <Image
                src="/logo.png"
                alt="Logo"
                width={100}
                height={100}
                className="w-25 h-25 object-contain"
                loading="eager"
              />
            </Link>
          </DrawerClose>

          <ul className="flex-1 overflow-y-auto flex flex-col min-h-0">
            {NAV_LINKS.map((link) => {
              // Skip rendering the dashboard link in the mobile nav if user is not an admin
              if (link.href === "/dashboard" && user?.role !== "ADMIN") {
                return null;
              }
              return (
                <li key={link.href} className="w-full">
                  <DrawerClose asChild>
                    <Link
                      className={`${pathname === link.href ? "active" : ""} nav-link mobile text-xl w-full p-4 block`}
                      href={link.href}
                    >
                      {link.title}
                    </Link>
                  </DrawerClose>
                </li>
              );
            })}
          </ul>

          <DrawerTitle className="sr-only">Navigációs menü</DrawerTitle>
          <DrawerDescription className="sr-only">
            A weboldal fő navigációs linkjei
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="border-t">
          <DrawerClose asChild>
            <Button
              variant="outline"
              className="cursor-pointer"
              aria-label="Close menu"
            >
              <X />
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
