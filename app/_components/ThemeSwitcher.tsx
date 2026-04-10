"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LaptopMinimalCheck, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Spinner } from "@/components/ui/spinner";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const currentThemeLabel =
    theme === "light" ? "Világos" : theme === "dark" ? "Sötét" : "Rendszer";

  const currentThemeIcon =
    theme === "light" ? (
      <Sun />
    ) : theme === "dark" ? (
      <Moon />
    ) : (
      <LaptopMinimalCheck />
    );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="outline"
        aria-label="loading theme"
        title="Téma kiválasztása"
      >
        <Spinner />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          aria-label={`Aktív téma: ${currentThemeLabel}`}
          title="Téma kiválasztása"
          className="cursor-pointer"
        >
          {currentThemeIcon}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 p-2">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Téma kiválasztása</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={theme}
            onValueChange={(value) =>
              setTheme(value as "light" | "dark" | "system")
            }
          >
            <DropdownMenuRadioItem value="light">
              <Sun className="mr-2" />
              Világos
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dark">
              <Moon className="mr-2" />
              Sötét
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="system">
              <LaptopMinimalCheck className="mr-2" />
              Rendszer
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
