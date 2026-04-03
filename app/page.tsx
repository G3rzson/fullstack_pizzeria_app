import Image from "next/image";
import logo_lg from "@/public/logo_lg.png";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="centered-container">
      <Card className="bg-gradient p-4">
        <div className="relative mx-auto w-70 md:w-100 h-70 md:h-100">
          <Image
            src={logo_lg}
            alt="Logo"
            fill
            className="object-cover select-none pointer-events-none"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw"
            priority
          />
        </div>

        <h1 className="page-title">Üdv az oldalon!</h1>
        <p>
          Ez egy mintaalkalmazás. Kérlek ne adj meg valódi adatokat, és ne
          használd éles környezetben! Ez az oldal csak bemutató céllal készült,
          és nem rendelkezik valós funkcionalitással. Köszönöm a megértést!
        </p>
      </Card>
    </div>
  );
}
