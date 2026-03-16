import { getAllAvailablePizzaAction } from "../Actions/getAllAvailablePizza.action";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import PizzaImage from "./PizzaImage";
import PizzaContent from "./PizzaContent";
import CustomError from "@/components/ui/CustomError";
import CustomEmptyList from "@/components/ui/CustomEmptyList";

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
            <Card className="relative h-100 w-full">
              <PizzaImage
                publicUrl={pizza.publicUrl}
                originalName={pizza.originalName}
              />

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
