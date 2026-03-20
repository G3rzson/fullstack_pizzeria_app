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
import { useRef, useState } from "react";
import { NAV_LINKS } from "../Constants/Constants";
import Link from "next/link";
import Logo from "./Logo";

export default function MobileNav() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  return (
    <div className="md:hidden">
      <Drawer
        direction="left"
        open={isDrawerOpen}
        onOpenChange={(nextOpen) => {
          if (nextOpen && document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }

          setIsDrawerOpen(nextOpen);
        }}
      >
        <DrawerTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu />
          </Button>
        </DrawerTrigger>

        <DrawerContent
          className="w-80 max-w-[85vw]"
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            closeButtonRef.current?.focus();
          }}
        >
          <div className="absolute right-4 top-4">
            <DrawerClose asChild>
              <Button ref={closeButtonRef} variant="ghost" size="icon">
                <X />
              </Button>
            </DrawerClose>
          </div>

          <div className="flex items-center justify-center border-b">
            <DrawerHeader>
              <DrawerTitle className="sr-only">Navigációs menü</DrawerTitle>
              <DrawerDescription className="sr-only">
                A weboldal fő navigációs linkjei
              </DrawerDescription>
              <Logo />
            </DrawerHeader>
          </div>

          <nav className="flex grow w-full">
            <ul className="flex flex-col w-full">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <DrawerClose asChild>
                    <Link
                      className="px-3 py-3 hover:bg-muted block"
                      href={link.href}
                    >
                      {link.label}
                    </Link>
                  </DrawerClose>
                </li>
              ))}
            </ul>
          </nav>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
