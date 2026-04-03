import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Adatvédelmi Tájékoztató | Fullstack Pizzeria App",
  description:
    "Adatvédelmi és süti tájékoztató a Fullstack Pizzeria demo alkalmazáshoz.",
};

export default function PrivacyPage() {
  return (
    <Card className="bg-gradient">
      <CardHeader>
        <h1 className="text-3xl font-bold">Adatvédelmi Tájékoztató</h1>
        <p className="text-muted-foreground mt-2">
          Utoljára frissítve: 2026. április
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Bevezető</h2>
          <p className="text-muted-foreground">
            Ez egy demo/portfólió projekt, amely nem valós üzleti tevékenységet
            folytat. Az alkalmazás kizárólag bemutatási célokat szolgál.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">2. Adatgyűjtés</h2>
          <p className="text-muted-foreground mb-2">
            Az alábbi adatokat gyűjtjük:
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>
              <strong>Regisztráció:</strong> Email cím, név, jelszó (titkosítva)
            </li>
            <li>
              <strong>Sütik:</strong> Munkamenet kezelés és preferenciák
              tárolása
            </li>
            <li>
              <strong>Feltöltött tartalmak:</strong> Képek és termékadatok
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3. Adatkezelés</h2>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Az adatok helyi adatbázisban kerülnek tárolásra</li>
            <li>Jelszavak bcrypt titkosítással vannak védve</li>
            <li>JWT tokenekkel történik az autentikáció</li>
            <li>Az adatok nem kerülnek továbbításra harmadik félnek</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. Sütik</h2>
          <p className="text-muted-foreground mb-2">
            Az alábbi sütiket használjuk:
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>
              <strong>Autentikációs token:</strong> Bejelentkezés megőrzése
            </li>
            <li>
              <strong>Téma preferencia:</strong> Világos/sötét téma tárolása
            </li>
            <li>
              <strong>Cookie consent:</strong> Süti elfogadás tárolása
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">5. Felhasználói jogok</h2>
          <p className="text-muted-foreground">
            Jogosult vagy adataid megtekintésére, módosítására és törlésére.
            Mivel ez egy demo projekt, kérjük ne adj meg valós személyes
            adatokat.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">6. Biztonság</h2>
          <p className="text-muted-foreground">
            Minden tőlünk telhetőt megteszünk az adatok védelme érdekében,
            azonban felhívjuk figyelmedet, hogy ez egy demo alkalmazás, ezért ne
            használj valós vagy érzékeny adatokat.
          </p>
        </section>

        <section className="pt-4 border-t">
          <p className="text-sm text-muted-foreground italic">
            Ez egy portfólió projekt adatvédelmi tájékoztatója. Valós üzleti
            környezetben részletesebb és jogi szempontból auditált
            dokumentációra lenne szükség.
          </p>
        </section>
      </CardContent>
    </Card>
  );
}
