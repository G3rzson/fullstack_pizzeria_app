import {
  Card,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Pizza } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { generateBlurUrl } from "@/lib/generateBlurUrl";
import { getAllAvailablePizzaAction } from "../_actions/getAllAvailablePizzaAction";
import PizzaSizeSelector from "./PizzaSizeSelector";
import { textFormatter } from "@/shared/Functions/textFormatter";

export default async function PizzaList() {
  const response = await getAllAvailablePizzaAction();

  if (!response.success)
    return (
      <div>Hiba történt a pizzák lekérése során! Próbáld újra később.</div>
    );

  const pizzasArray = response.data || [];

  if (pizzasArray.length === 0)
    return <div>Jelenleg nincs elérhető pizza.</div>;

  return (
    <ul className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
      {pizzasArray.map((pizza) => (
        <li key={pizza.id}>
          <Card className="h-full w-full">
            <div className="flex flex-row items-start justify-between gap-4 px-4">
              {pizza.publicUrl ? (
                <div className="relative shrink-0 h-30 w-30 lg:w-50 lg:h-50">
                  <Image
                    src={pizza.publicUrl}
                    alt={pizza.pizzaName}
                    fill
                    placeholder="blur"
                    blurDataURL={generateBlurUrl(pizza.publicUrl)}
                    className="object-cover select-none pointer-events-none"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              ) : (
                <div className="relative shrink-0 h-30 w-30 lg:w-50 lg:h-50">
                  <Pizza className="w-full h-full" />
                </div>
              )}

              <div className="flex flex-col items-end justify-end gap-2">
                <CardTitle className="text-lg lg:text-xl">
                  {textFormatter(pizza.pizzaName)}
                </CardTitle>

                <CardDescription className="text-end text-balance">
                  {pizza.pizzaDescription}
                </CardDescription>
              </div>
            </div>

            <PizzaSizeSelector pizza={pizza} />

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
