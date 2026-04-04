import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pizza } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { getAllPizzaAction } from "../_actions/getAllPizzaAction";
import ChangePizzaMenuStateBtn from "./ChangePizzaMenuStateBtn";
import DeletePizzaBtn from "@/app/dashboard/pizzas/_components/DeletePizzaBtn";
import MenuNavLink from "@/shared/Components/MenuNavLink";
import { generateBlurUrl } from "@/lib/generateBlurUrl";
import ServerError from "@/shared/Components/ServerError";
import EmptyList from "@/shared/Components/EmptyList";

export default async function PizzaList() {
  const response = await getAllPizzaAction();

  if (!response.success || !response.data)
    return (
      <ServerError
        errorMsg={response.message}
        path="/dashboard"
        title="Vissza a dashboardra"
      />
    );

  if (response.data.length === 0)
    return <EmptyList text="Jelenleg nincs elérhető pizza!" />;

  return (
    <ul className="menu-grid">
      {response.data.map((pizza) => (
        <li key={pizza.id}>
          <Card className="h-full w-full">
            <CardHeader className="w-full flex flex-row justify-between px-4">
              <CardContent className="flex items-center justify-center h-30 w-30 lg:w-50 lg:h-50 p-0">
                {pizza.image?.publicUrl ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={pizza.image.publicUrl}
                      alt={pizza.pizzaName}
                      fill
                      placeholder="blur"
                      blurDataURL={generateBlurUrl(pizza.image.publicUrl)}
                      className="rounded-xl object-cover select-none pointer-events-none"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                ) : (
                  <Pizza className="w-full h-full" />
                )}
              </CardContent>

              <CardContent className="flex flex-col gap-2 p-0 w-45">
                <Badge
                  className={`${pizza.isAvailableOnMenu ? "bg-green-500/20" : "bg-destructive/20"} p-3 text-foreground w-full text-center`}
                >
                  {pizza.isAvailableOnMenu ? "Elérhető" : "Nem elérhető"}
                </Badge>

                <ChangePizzaMenuStateBtn
                  id={pizza.id}
                  isAvailableOnMenu={pizza.isAvailableOnMenu}
                />

                <MenuNavLink
                  href={`/dashboard/pizzas/image/upload/${pizza.id}`}
                  title={pizza.image?.publicId ? "Kép frissítése" : "Kép feltöltése"}
                />

                <MenuNavLink
                  href={`/dashboard/pizzas/edit/${pizza.id}`}
                  title="Pizza szerkesztése"
                />

                <DeletePizzaBtn id={pizza.id} publicId={pizza.image?.publicId ?? null} />
              </CardContent>
            </CardHeader>

            <CardContent className="space-y-2 h-full">
              <CardTitle> {pizza.pizzaName} </CardTitle>
              <CardTitle>Ár (32 cm): {pizza.pizzaPrice32} Ft</CardTitle>
              <CardTitle>Ár (45 cm): {pizza.pizzaPrice45} Ft</CardTitle>
              <CardTitle className="text-balance mt-auto">
                {pizza.pizzaDescription}
              </CardTitle>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}
