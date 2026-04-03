"use client";

import { useState } from "react";
import {
  Card,
  CardTitle,
  CardFooter,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Pizza } from "lucide-react";
import Image from "next/image";
import { generateBlurUrl } from "@/lib/generateBlurUrl";
import { textFormatter } from "@/shared/Functions/textFormatter";
import AddToCartBtn from "@/shared/Components/AddToCartBtn";
import type { FormattedPizzaType } from "../_actions/getAllAvailablePizzaAction";

type Props = {
  pizza: FormattedPizzaType;
};

export default function PizzaCard({ pizza }: Props) {
  const [selectedSize, setSelectedSize] = useState<32 | 45>(32);

  const size32Id = `size32-${pizza.id}`;
  const size45Id = `size45-${pizza.id}`;

  return (
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

      <CardContent className="space-y-2">
        <div className="flex flex-row items-center justify-between w-full">
          <p className="text-green-500 font-semibold whitespace-nowrap">
            {selectedSize === 32 ? pizza.pizzaPrice32 : pizza.pizzaPrice45} Ft
          </p>
          <RadioGroup
            value={selectedSize.toString()}
            onValueChange={(value) => setSelectedSize(Number(value) as 32 | 45)}
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
                className={`cursor-pointer ${selectedSize === 32 ? "text-green-500" : ""}`}
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
                className={`cursor-pointer ${selectedSize === 45 ? "text-green-500" : ""}`}
              >
                45 cm
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>

      <CardFooter>
        <AddToCartBtn menu={pizza} type="pizza" size={selectedSize} />
      </CardFooter>
    </Card>
  );
}
