import { Card, CardTitle, CardFooter } from "@/components/ui/card";
import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { generateBlurUrl } from "@/lib/generateBlurUrl";
import { textFormatter } from "@/shared/Functions/textFormatter";
import { getAllAvailableDrinkAction } from "../_actions/getAllAvailableDrinkAction";
import AddToCartBtn from "@/shared/Components/AddToCartBtn";
import ServerError from "@/shared/Components/ServerError";
import EmptyList from "@/shared/Components/EmptyList";

export default async function DrinkList() {
  const response = await getAllAvailableDrinkAction();

  if (!response.success || !response.data)
    return (
      <ServerError
        errorMsg={response.message}
        path="/"
        title="Vissza a főoldalra"
      />
    );

  if (response.data.length === 0)
    return <EmptyList text="Jelenleg nincs elérhető ital!" />;

  return (
    <ul className="menu-grid">
      {response.data.map((drink) => (
        <li key={drink.id}>
          <Card className="bg-gradient h-full w-full">
            <div className="flex flex-row items-start justify-between gap-4 px-4">
              {drink.image ? (
                <div className="relative shrink-0 h-30 w-30 lg:w-50 lg:h-50">
                  <Image
                    src={drink.image.publicUrl}
                    alt={drink.drinkName}
                    fill
                    placeholder="blur"
                    blurDataURL={generateBlurUrl(drink.image.publicUrl)}
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
                <CardTitle className="card-title">
                  {textFormatter(drink.drinkName)}
                </CardTitle>

                <p className="text-end text-green-500 font-semibold mt-auto">
                  {drink.drinkPrice} Ft
                </p>
              </div>
            </div>

            <CardFooter>
              <AddToCartBtn menu={drink} type="drink" />
            </CardFooter>
          </Card>
        </li>
      ))}
    </ul>
  );
}
