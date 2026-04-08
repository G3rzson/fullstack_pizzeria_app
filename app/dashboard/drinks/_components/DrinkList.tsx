import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image as ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import MenuNavLink from "@/shared/Components/MenuNavLink";
import { getAllDrinkAction } from "../_actions/getAllDrinkAction";
import { generateBlurUrl } from "@/lib/claudinary/generateBlurUrl";
import ChangeDrinkMenuStateBtn from "./ChangeDrinkMenuStateBtn";
import DeleteDrinkBtn from "./DeleteDrinkBtn";
import ServerError from "@/shared/Components/ServerError";

export default async function DrinkList() {
  const response = await getAllDrinkAction();

  if (!response.success || !response.data)
    return (
      <ServerError
        errorMsg={response.message}
        path="/dashboard"
        title="Vissza a dashboardra"
      />
    );

  if (response.data.length === 0)
    return <div>Jelenleg nincs elérhető ital.</div>;

  return (
    <ul className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
      {response.data.map((drink) => (
        <li key={drink.id}>
          <Card className="h-full w-full">
            <CardHeader className="w-full flex flex-row justify-between px-4">
              <CardContent className="flex items-center justify-center h-30 w-30  lg:w-50 lg:h-50">
                {drink.image ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={drink.image.publicUrl}
                      alt={drink.drinkName}
                      fill
                      placeholder="blur"
                      blurDataURL={generateBlurUrl(drink.image.publicUrl)}
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
                  className={`${drink.isAvailableOnMenu ? "bg-green-500/20" : "bg-destructive/20"} text-foreground w-full p-3`}
                >
                  {drink.isAvailableOnMenu ? "Elérhető" : "Nem elérhető"}
                </Badge>

                <ChangeDrinkMenuStateBtn
                  id={drink.id}
                  isAvailableOnMenu={drink.isAvailableOnMenu}
                />

                <MenuNavLink
                  href={`/dashboard/drinks/image/upload/${drink.id}`}
                  title={
                    drink.image?.publicId ? "Kép frissítése" : "Kép feltöltése"
                  }
                />

                <MenuNavLink
                  href={`/dashboard/drinks/edit/${drink.id}`}
                  title="Ital szerkesztése"
                />

                <DeleteDrinkBtn
                  id={drink.id}
                  publicId={drink.image?.publicId ?? null}
                />
              </CardContent>
            </CardHeader>

            <CardContent className="space-y-2 h-full">
              <CardTitle> {drink.drinkName} </CardTitle>
              <CardTitle>Ár: {drink.drinkPrice} Ft</CardTitle>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}
