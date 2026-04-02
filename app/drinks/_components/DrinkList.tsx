import { Card, CardTitle, CardFooter } from "@/components/ui/card";
import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { generateBlurUrl } from "@/lib/generateBlurUrl";
import { textFormatter } from "@/shared/Functions/textFormatter";
import { getAllAvailableDrinkAction } from "../_actions/getAllAvailableDrinkAction";

export default async function DrinkList() {
  const response = await getAllAvailableDrinkAction();

  if (!response.success)
    return (
      <div>Hiba történt a italok lekérése során! Próbáld újra később.</div>
    );

  const drinksArray = response.data || [];

  if (drinksArray.length === 0) return <div>Jelenleg nincs elérhető ital.</div>;

  return (
    <ul className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
      {drinksArray.map((drink) => (
        <li key={drink.id}>
          <Card className="h-full w-full">
            <div className="flex flex-row items-start justify-between gap-4 px-4">
              {drink.publicUrl ? (
                <div className="relative shrink-0 h-30 w-30 lg:w-50 lg:h-50">
                  <Image
                    src={drink.publicUrl}
                    alt={drink.drinkName}
                    fill
                    placeholder="blur"
                    blurDataURL={generateBlurUrl(drink.publicUrl)}
                    className="object-cover select-none pointer-events-none"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              ) : (
                <div className="relative shrink-0 h-30 w-30 lg:w-50 lg:h-50">
                  <ImageIcon className="w-full h-full" />
                </div>
              )}

              <div className="flex flex-col items-end justify-end gap-2 h-full">
                <CardTitle className="text-lg lg:text-xl">
                  {textFormatter(drink.drinkName)}
                </CardTitle>

                <p className="text-end text-green-500 font-semibold mt-auto">
                  {drink.drinkPrice} Ft
                </p>
              </div>
            </div>

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
