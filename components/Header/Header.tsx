import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.png";
import Navigation from "./Navigation";

/*--------------------------------------------------------
  TODO: töréspont beállítása a hamburger menühöz        
  --------------------------------------------------------*/

export default function Header() {
  return (
    <header className="dark:bg-zinc-800 dark:text-zinc-200 bg-zinc-200 text-zinc-800 w-full border-b border-zinc-500">
      <div className="relative mx-auto w-full sm:w-4/5 flex itmes-center justify-end">
        {/* Logo */}
        <Link
          href="/"
          aria-label="Főoldal"
          className="absolute sm:left-0 sm:top-0 top-2 left-2 z-100"
        >
          <Image
            src={logo}
            alt="Pizzéria logo"
            className="h-20 w-20 sm:h-32 sm:w-32"
            height={130}
            width={130}
            priority
          />
        </Link>

        {/* Navigation */}
        <Navigation />
      </div>
    </header>
  );
}
