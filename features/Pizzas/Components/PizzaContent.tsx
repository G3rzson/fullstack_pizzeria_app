"use client";
import { CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";

export default function PizzaContent({ pizza }: { pizza: any }) {
  const [selectedPizzaSize, setSelectedPizzaSize] = useState<
    "size32" | "size45"
  >("size32");

  const size32Id = `size32-${pizza.id}`;
  const size45Id = `size45-${pizza.id}`;

  return (
    <CardContent className="space-y-2">
      <div className="flex flex-row items-center justify-between w-full">
        <p className="text-green font-semibold whitespace-nowrap">
          {`${
            selectedPizzaSize === "size32"
              ? `${pizza.pizzaPrice32}`
              : `${pizza.pizzaPrice45}`
          } Ft`}
        </p>
        <RadioGroup
          value={selectedPizzaSize}
          onValueChange={(value: "size32" | "size45") =>
            setSelectedPizzaSize(value)
          }
          className="flex items-center justify-end gap-3"
        >
          <div className="flex items-center gap-3">
            <RadioGroupItem
              value="size32"
              className="cursor-pointer"
              id={size32Id}
            />
            <Label
              htmlFor={size32Id}
              className={`cursor-pointer ${selectedPizzaSize === "size32" ? "text-green" : ""}`}
            >
              32 cm
            </Label>
          </div>

          <div className="flex items-center gap-3">
            <RadioGroupItem
              value="size45"
              className="cursor-pointer"
              id={size45Id}
            />
            <Label
              htmlFor={size45Id}
              className={`cursor-pointer ${selectedPizzaSize === "size45" ? "text-green" : ""}`}
            >
              45 cm
            </Label>
          </div>
        </RadioGroup>
      </div>
    </CardContent>
  );
}
