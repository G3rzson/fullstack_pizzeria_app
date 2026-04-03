import Image from "next/image";
import logo_lg from "@/public/logo_lg.png";
import { Card, CardHeader } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex grow items-center justify-center">
      <Card className="w-full">
        <div className="relative mx-auto w-80 sm:w-100 h-80 sm:h-100">
          <Image
            src={logo_lg}
            alt="Logo"
            fill
            className="object-cover select-none pointer-events-none"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority
          />
        </div>

        <CardHeader className="text-center">
          <h1 className="text-4xl font-bold mb-4">Üdv az oldalon!</h1>
          <p className="md:text-xl text-amber-500">
            Ez egy mintaalkalmazás. Kérlek ne adj meg valódi adatokat, és ne
            használd éles környezetben! Ez az oldal csak bemutató céllal
            készült, és nem rendelkezik valós funkcionalitással. Köszönöm a
            megértést!
          </p>
        </CardHeader>
      </Card>
    </div>
  );
}
