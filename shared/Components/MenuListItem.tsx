"use client";

import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { generateBlurUrl } from "@/lib/claudinary/generateBlurUrl";
import { textFormatter } from "@/shared/Functions/textFormatter";
import AddToCartBtn from "@/lib/cart/AddToCartBtn";
import { DrinkDtoType, PastaDtoType, PizzaDtoType } from "../Types/types";
import { priceFormatter } from "../Functions/priceFormatter";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type Props = {
  menuArray: DrinkDtoType | PastaDtoType | PizzaDtoType;
};

export default function MenuListItem({ menuArray }: Props) {
  const [selectedSize, setSelectedSize] = useState<32 | 45>(32);

  let imageAltText: string;
  let title: string;
  let price: number;
  let type: "drink" | "pasta" | "pizza";
  let description: string | undefined;

  if ("drinkName" in menuArray) {
    imageAltText = menuArray.drinkName;
    title = menuArray.drinkName;
    price = menuArray.drinkPrice;
    type = "drink";
  } else if ("pastaName" in menuArray) {
    imageAltText = menuArray.pastaName;
    title = menuArray.pastaName;
    price = menuArray.pastaPrice;
    type = "pasta";
    description = menuArray.pastaDescription;
  } else {
    imageAltText = menuArray.pizzaName;
    title = menuArray.pizzaName;
    price =
      selectedSize === 32 ? menuArray.pizzaPrice32 : menuArray.pizzaPrice45;
    type = "pizza";
    description = menuArray.pizzaDescription;
  }

  const size32Id = `size32-${menuArray.id}`;
  const size45Id = `size45-${menuArray.id}`;
  const isPizza = type === "pizza";

  return (
    <li>
      <Card className="bg-gradient h-full w-full">
        <div className="flex flex-row items-start justify-between gap-4 px-4">
          {menuArray.image ? (
            <div className="relative shrink-0 h-30 w-30 lg:w-50 lg:h-50">
              <Image
                src={menuArray.image.publicUrl}
                alt={imageAltText}
                fill
                placeholder="blur"
                blurDataURL={generateBlurUrl(menuArray.image.publicUrl)}
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
            <CardTitle className="card-title">{textFormatter(title)}</CardTitle>

            {(type === "pasta" || type === "pizza") && (
              <p className="card-description">{description}</p>
            )}

            <p className="text-end text-success font-semibold mt-auto">
              {priceFormatter(price)}
            </p>
          </div>
        </div>

        {isPizza && (
          <CardContent className="space-y-2">
            <div className="flex flex-row items-center justify-between w-full">
              <RadioGroup
                value={selectedSize.toString()}
                onValueChange={(value) =>
                  setSelectedSize(Number(value) as 32 | 45)
                }
                className="flex items-center justify-end gap-3"
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem
                    value="32"
                    className="cursor-pointer"
                    id={size32Id}
                  />
                  <Label
                    htmlFor={size32Id}
                    className={`cursor-pointer ${selectedSize === 32 ? "text-success" : ""}`}
                  >
                    32 cm
                  </Label>
                </div>

                <div className="flex items-center gap-3">
                  <RadioGroupItem
                    value="45"
                    className="cursor-pointer"
                    id={size45Id}
                  />
                  <Label
                    htmlFor={size45Id}
                    className={`cursor-pointer ${selectedSize === 45 ? "text-success" : ""}`}
                  >
                    45 cm
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        )}

        <CardFooter>
          <AddToCartBtn
            menu={menuArray}
            type={type}
            size={isPizza ? selectedSize : undefined}
          />
        </CardFooter>
      </Card>
    </li>
  );
}
