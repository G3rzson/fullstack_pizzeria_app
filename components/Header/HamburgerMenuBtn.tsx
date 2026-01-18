"use client";

import { X, Menu } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

type Props = {
  isMenuOpen: boolean;
  setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
};

export default function HamburgerMenuBtn({ isMenuOpen, setIsMenuOpen }: Props) {
  return (
    <div className="w-full flex justify-end sm:hidden">
      <button
        id="hamburger-button"
        type="button"
        className="m-4 cursor-pointer"
        aria-label={isMenuOpen ? "Menü bezárása" : "Menü kinyitása"}
        aria-controls="nav-panel"
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen((prev) => !prev)}
      >
        <span className="relative block h-6 w-6">
          <Menu
            className={`absolute inset-0 transition-all duration-200 ease-out ${
              isMenuOpen
                ? "opacity-0 rotate-90 scale-75"
                : "opacity-100 rotate-0 scale-100"
            }`}
          />
          <X
            className={`absolute inset-0 transition-all duration-200 ease-out ${
              isMenuOpen
                ? "opacity-100 rotate-0 scale-100"
                : "opacity-0 -rotate-90 scale-75"
            }`}
          />
        </span>
      </button>
    </div>
  );
}
