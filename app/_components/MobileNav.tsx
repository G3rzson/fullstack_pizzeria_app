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

export default function MobileNav() {
  const pathname = usePathname();
  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="capitalize md:hidden"
          onClick={(e) => e.currentTarget.blur()}
        >
          <Menu />
        </Button>
      </DrawerTrigger>
      <DrawerContent
        autoFocus
        className="data-[vaul-drawer-direction=bottom]:max-h-[50vh] data-[vaul-drawer-direction=top]:max-h-[50vh]"
      >
        <DrawerHeader className="p-0">
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
          <div className="no-scrollbar overflow-y-auto">
            <ul className="flex flex-col items-start">
              {NAV_LINKS.map((link) => (
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
              ))}
            </ul>
          </div>
          <DrawerTitle className="sr-only">Navigációs menü</DrawerTitle>
          <DrawerDescription className="sr-only">
            A weboldal fő navigációs linkjei
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="border-t">
          <DrawerClose asChild>
            <Button variant="outline" className="cursor-pointer">
              <X />
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
