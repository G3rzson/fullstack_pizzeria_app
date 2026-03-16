import { Card } from "@/components/ui/card";
import CustomEmptyList from "@/components/ui/CustomEmptyList";
import CustomError from "@/components/ui/CustomError";
import { getAllPizzaAction } from "@/features/Pizzas/Actions/getAllPizza.action";
import { Pizza } from "lucide-react";
import Image from "next/image";
import PizzaMenu from "./PizzaMenu";

export default async function AdminPizzaList() {
  const response = await getAllPizzaAction();

  if (!response.success)
    return (
      <CustomError message="Hiba történt a pizzák lekérése során! Próbáld újra később." />
    );

  const pizzasArray = response.data || [];

  if (pizzasArray.length === 0)
    return <CustomEmptyList message="Jelenleg nincs elérhető pizza." />;

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
      {pizzasArray.map((pizza) => (
        <li key={pizza.id}>
          <Card
            className={`w-full relative p-4 ${pizza.isAvailableOnMenu ? "bg-green/20" : "bg-destructive/20"}`}
          >
            {pizza.publicUrl && pizza.originalName ? (
              <Image
                src={pizza.publicUrl}
                alt={pizza.originalName}
                width={100}
                height={100}
                className="object-contain select-none pointer-events-none"
                loading="eager"
              />
            ) : (
              <Pizza size={100} />
            )}

            <p>{pizza.pizzaName}</p>

            <p>Ár (32 cm): {pizza.pizzaPrice32} Ft</p>
            <p>Ár (45 cm): {pizza.pizzaPrice45} Ft</p>
            <p> {pizza.isAvailableOnMenu ? "Elérhető" : "Nem elérhető"}</p>
            <p className="text-balance">{pizza.pizzaDescription}</p>

            <PizzaMenu pizza={pizza} />
          </Card>
        </li>
      ))}
    </ul>
  );
}
