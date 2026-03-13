import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeSwitcher } from "@/features/ThemeSwicher/ThemeSwitcher";
import { Settings } from "lucide-react";

export default function SettingsMenu({ type }: { type: "mobile" | "desktop" }) {
  const isMobile = type === "mobile";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <Settings className={isMobile ? "size-4" : "size-6"} />
          {isMobile ? "Beállítások" : ""}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={isMobile ? "center" : "end"}
        className={`${isMobile ? "" : "w-fit"} min-w-56`}
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>Beállítások</DropdownMenuLabel>
          <ThemeSwitcher isMobile={isMobile} />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
