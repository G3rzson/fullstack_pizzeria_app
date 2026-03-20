import { getAllAvailablePizzaAction } from "../Actions/getAllAvailablePizza.action";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import PizzaContent from "./PizzaContent";
import CustomError from "@/shared/Components/CustomError";
import CustomEmptyList from "@/shared/Components/CustomEmptyList";
import Image from "next/image";
import { Pizza } from "lucide-react";
import { formatTitle } from "@/shared/Functions/titleFormatter";

export default async function PizzaList() {
  const response = await getAllAvailablePizzaAction();

  if (!response.success)
    return (
      <CustomError message="Hiba történt a pizzák lekérése során! Próbáld újra később." />
    );

  const pizzasArray = response.data || [];

  if (pizzasArray.length === 0)
    return (
      <CustomEmptyList message="Jelenleg nincs elérhető pizza a kínálatban." />
    );

  return (
    <>
      <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {pizzasArray.map((pizza) => (
          <li key={pizza.id}>
            <Card className="relative w-full h-full">
              {pizza.image ? (
                <Image
                  src={pizza.image.publicUrl}
                  alt={pizza.image.originalName}
                  width={220}
                  height={220}
                  className="object-contain select-none pointer-events-none"
                  loading="eager"
                />
              ) : (
                <Pizza size={220} />
              )}

              <CardTitle className="absolute top-4 right-4">
                {formatTitle(pizza.pizzaName)}
              </CardTitle>
              <CardDescription className="px-4 mt-auto">
                {formatTitle(pizza.pizzaDescription)}
              </CardDescription>

              <PizzaContent pizza={pizza} />

              <CardFooter className="mt-0">
                <Button variant={"outline"} className="w-full cursor-pointer">
                  Kosárba
                </Button>
              </CardFooter>
            </Card>
          </li>
        ))}
      </ul>
    </>
  );
}
