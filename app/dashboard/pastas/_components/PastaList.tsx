import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Image as ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getAllPastaAction } from "../_actions/getAllPastaAction";
import DeletePastaBtn from "./DeletePastaBtn";
import MenuNavLink from "@/shared/Components/MenuNavLink";
import ChangePastaMenuStateBtn from "./ChangePastaMenuStateBtn";
import { generateBlurUrl } from "@/lib/generateBlurUrl";

export default async function PastaList() {
  const response = await getAllPastaAction();

  if (!response.success)
    return (
      <div>Hiba történt a pasták lekérése során! Próbáld újra később.</div>
    );

  const pastasArray = response.data || [];

  if (pastasArray.length === 0)
    return <div>Jelenleg nincs elérhető pasta.</div>;

  return (
    <ul className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
      {pastasArray.map((pasta) => (
        <li key={pasta.id}>
          <Card className="h-full w-full">
            <div className="w-full flex flex-row justify-between px-4">
              <div className="flex items-center justify-center h-30 w-30  lg:w-50 lg:h-50">
                {pasta.publicUrl ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={pasta.publicUrl}
                      alt={pasta.pastaName}
                      fill
                      placeholder="blur"
                      blurDataURL={generateBlurUrl(pasta.publicUrl)}
                      className="rounded-xl object-cover select-none pointer-events-none"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                ) : (
                  <ImageIcon className="w-full h-full" />
                )}
              </div>

              <div className="flex flex-col gap-2 items-end">
                <Badge
                  className={`${pasta.isAvailableOnMenu ? "bg-green-500/20" : "bg-destructive/20"} p-3 text-foreground w-40`}
                >
                  {pasta.isAvailableOnMenu ? "Elérhető" : "Nem elérhető"}
                </Badge>

                <ChangePastaMenuStateBtn
                  id={pasta.id}
                  isAvailableOnMenu={pasta.isAvailableOnMenu}
                />

                <MenuNavLink
                  href={`/dashboard/pastas/image/upload/${pasta.pastaId ? pasta.pastaId : pasta.id}`}
                  title={pasta.pastaId ? "Kép frissítése" : "Kép feltöltése"}
                />

                <MenuNavLink
                  href={`/dashboard/pastas/edit/${pasta.id}`}
                  title="Tészta szerkesztése"
                />

                <DeletePastaBtn id={pasta.id} publicId={pasta.publicId} />
              </div>
            </div>

            <CardHeader>
              <CardTitle> {pasta.pastaName} </CardTitle>
            </CardHeader>

            <CardContent className="space-y-2 h-full">
              <CardTitle>Ár: {pasta.pastaPrice} Ft</CardTitle>
              <CardTitle className="text-balance mt-auto">
                {pasta.pastaDescription}
              </CardTitle>
            </CardContent>

            <CardFooter>
              <Button variant="default" className="w-full">
                Hozzáadás a kosárhoz
              </Button>
            </CardFooter>
          </Card>
        </li>
      ))}
    </ul>
  );
}
