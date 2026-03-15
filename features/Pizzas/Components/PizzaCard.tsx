"use client";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { PizzaGetType } from "../Dal/pizza.dal";
import PizzaImage from "./PizzaImage";
import PizzaContent from "./PizzaContent";
import PizzaMenu from "./PizzaMenu";

type Props = {
  pizza: PizzaGetType;
  isAdmin: boolean;
};

export default function PizzaCard({ pizza, isAdmin }: Props) {
  return (
    <li key={pizza.id}>
      <Card className="relative h-100 w-full">
        {isAdmin && (
          <>
            {pizza.isAvailableOnMenu ? (
              <div className="absolute top-0 left-0 w-full h-full bg-green-600/30 z-10"></div>
            ) : (
              <div className="absolute top-0 left-0 w-full h-full bg-red-600/30 z-10"></div>
            )}
          </>
        )}
        <PizzaImage
          publicUrl={pizza.publicUrl}
          originalName={pizza.originalName}
        />

        <PizzaContent pizza={pizza} />

        {isAdmin && <PizzaMenu pizza={pizza} />}

        <CardFooter className="mt-0">
          <Button variant={"outline"} className="w-full cursor-pointer">
            Kosárba
          </Button>
        </CardFooter>
      </Card>
    </li>
  );
}
