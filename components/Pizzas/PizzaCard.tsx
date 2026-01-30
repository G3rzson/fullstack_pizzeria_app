"use client";

import { Pizza } from "lucide-react";
import { useState } from "react";
import PizzaDeleteBtn from "./PizzaDeleteBtn";

type Props = {
  pizza: {
    id: string;
    pizzaName: string;
    pizzaPrice32: number;
    pizzaPrice45: number;
    pizzaDescription: string;
  };
};

export default function PizzaCard({ pizza }: Props) {
  const [pizzaSize, setPizzaSize] = useState<32 | 45>(32);
  return (
    <>
      <li className="w-full group bg-zinc-900 p-4 relative flex flex-col items-left gap-4">
        <div>
          <Pizza size={130} />
        </div>
        <p className="absolute top-3 right-6 text-2xl">{pizza.pizzaName}</p>
        <p className="text-right w-3/5 absolute top-16 right-6">
          {pizza.pizzaDescription}
        </p>

        <div className="flex flex-row gap-4 items-center">
          <p>Méret:</p>
          <button
            className={`${pizzaSize === 32 ? "bg-green-700" : "bg-zinc-600"} hover:bg-green-700 duration-300 px-4 py-1 cursor-pointer`}
            onClick={() => setPizzaSize(32)}
          >
            32 cm
          </button>
          <button
            className={`${pizzaSize === 45 ? "bg-green-700" : "bg-zinc-600"} hover:bg-green-700 duration-300 px-4 py-1 cursor-pointer`}
            onClick={() => setPizzaSize(45)}
          >
            45 cm
          </button>
        </div>

        <p>
          Ár: {pizzaSize === 32 ? pizza.pizzaPrice32 : pizza.pizzaPrice45} Ft
        </p>

        <div className="flex flex-col absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <PizzaDeleteBtn pizzaId={pizza.id} />
          <button className="w-full bg-amber-700 p-2 hover:bg-amber-800 duration-300">
            szerkesztés
          </button>
          <button className="w-full bg-amber-700 p-2 hover:bg-amber-800 duration-300">
            Kosárba
          </button>
        </div>
      </li>
    </>
  );
}
