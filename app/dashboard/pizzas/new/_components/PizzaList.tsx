import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllPizzaAction } from "../_actions/getAllPizzaAction";
import { Pizza } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ChangeMenu from "./ChangeMenu";
import DeletePizza from "./DeletePizza";
import EditPizza from "./EditPizza";
import PizzaImageBtn from "./PizzaImageBtn";
import Image from "next/image";

export default async function PizzaList() {
  const response = await getAllPizzaAction();

  if (!response.success)
    return (
      <div>Hiba történt a pizzák lekérése során! Próbáld újra később.</div>
    );

  const pizzasArray = response.data || [];

  if (pizzasArray.length === 0)
    return <div>Jelenleg nincs elérhető pizza.</div>;

  return (
    <ul className="w-full">
      {pizzasArray.map((pizza) => (
        <li key={pizza.id}>
          <Card className="h-full w-full">
            <div className="w-full flex flex-row justify-between px-4">
              <div className="flex items-center justify-center h-30 w-30  lg:w-10 lg:h-10">
                {pizza.publicUrl ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={pizza.publicUrl}
                      alt={pizza.pizzaName}
                      fill
                      placeholder="blur"
                      blurDataURL={pizza.publicUrl}
                      className="rounded-xl object-cover select-none pointer-events-none"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                ) : (
                  <Pizza className="w-full h-full" />
                )}
              </div>

              <div className="flex flex-col gap-2 items-end">
                <Badge
                  className={`${pizza.isAvailableOnMenu ? "bg-green-500/20" : "bg-destructive/20"} text-foreground w-40`}
                >
                  {pizza.isAvailableOnMenu ? "Elérhető" : "Nem elérhető"}
                </Badge>

                <ChangeMenu
                  pizzaId={pizza.id}
                  isAvailableOnMenu={pizza.isAvailableOnMenu}
                />
                <PizzaImageBtn pizzaId={pizza.id} />
                <EditPizza pizzaId={pizza.id} />
                <DeletePizza pizzaId={pizza.id} />
              </div>
            </div>

            <CardHeader>
              <CardTitle> {pizza.pizzaName} </CardTitle>
            </CardHeader>

            <CardContent className="space-y-2 h-full">
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
