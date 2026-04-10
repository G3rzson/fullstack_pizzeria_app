import DeletePastaBtn from "./DeletePastaBtn";
import MenuNavLink from "@/shared/Components/MenuNavLink";
import ChangePastaMenuStateBtn from "./ChangePastaMenuStateBtn";
import { generateBlurUrl } from "@/lib/claudinary/generateBlurUrl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image as ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { AdminPastaDtoType } from "@/shared/Types/types";

export default function PastaListItem({ pasta }: { pasta: AdminPastaDtoType }) {
  return (
    <li>
      <Card className="h-full w-full">
        <CardHeader className="w-full flex flex-row justify-between px-4">
          <CardContent className="flex items-center justify-center h-30 w-30 lg:w-50 lg:h-50 p-0">
            {pasta.image ? (
              <div className="relative w-full h-full">
                <Image
                  src={pasta.image.publicUrl}
                  alt={pasta.pastaName}
                  fill
                  placeholder="blur"
                  blurDataURL={generateBlurUrl(pasta.image.publicUrl)}
                  className="rounded-xl object-cover select-none pointer-events-none"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            ) : (
              <ImageIcon className="w-full h-full" />
            )}
          </CardContent>

          <CardContent className="flex flex-col gap-2 p-0 w-45">
            <Badge
              className={`${pasta.isAvailableOnMenu ? "bg-green-500/20" : "bg-destructive/20"} p-3 text-foreground w-full`}
            >
              {pasta.isAvailableOnMenu ? "Elérhető" : "Nem elérhető"}
            </Badge>

            <ChangePastaMenuStateBtn
              id={pasta.id}
              isAvailableOnMenu={pasta.isAvailableOnMenu}
            />

            <MenuNavLink
              href={`/dashboard/pastas/image/upload/${pasta.id}`}
              title={
                pasta.image?.publicId ? "Kép frissítése" : "Kép feltöltése"
              }
            />

            <MenuNavLink
              href={`/dashboard/pastas/edit/${pasta.id}`}
              title="Tészta szerkesztése"
            />

            <DeletePastaBtn
              id={pasta.id}
              publicId={pasta.image?.publicId ?? null}
            />
          </CardContent>
        </CardHeader>

        <CardContent className="space-y-2 h-full">
          <CardTitle> {pasta.pastaName} </CardTitle>
          <CardTitle>Ár: {pasta.pastaPrice} Ft</CardTitle>
          <CardTitle className="text-balance mt-auto">
            {pasta.pastaDescription}
          </CardTitle>
        </CardContent>
      </Card>
    </li>
  );
}
