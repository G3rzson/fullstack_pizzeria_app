import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CustomEmptyList from "@/components/ui/CustomEmptyList";
import CustomError from "@/components/ui/CustomError";
import { Pizza } from "lucide-react";
import { getAllPizzaAction } from "../Actions/getAllPizzaAction";
import { Badge } from "@/components/ui/badge";
import ChangeMenu from "./ChangeMenu";
import DeletePizza from "./DeletePizza";
import EditPizza from "./EditPizza";
import PizzaImageBtn from "./PizzaImageBtn";
import Image from "next/image";

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
          <Card className="h-full">
            <div className="flex items-center justify-center">
              {pizza.publicUrl ? (
                <Image
                  src={pizza.publicUrl}
                  alt={pizza.pizzaName}
                  width={160}
                  height={160}
                  loading="eager"
                  className="w-40 h-40 object-cover"
                />
              ) : (
                <Pizza size={150} />
              )}
            </div>

            <CardHeader>
              <CardAction>
                <Badge
                  className={`${pizza.isAvailableOnMenu ? "bg-green/20" : "bg-destructive/20"} text-foreground w-40`}
                >
                  {pizza.isAvailableOnMenu ? "Elérhető" : "Nem elérhető"}
                </Badge>
              </CardAction>
              <CardTitle> {pizza.pizzaName} </CardTitle>
            </CardHeader>

            <CardContent className="space-y-2 h-full">
              <CardTitle>Ár (32 cm): {pizza.pizzaPrice32} Ft</CardTitle>
              <CardTitle>Ár (45 cm): {pizza.pizzaPrice45} Ft</CardTitle>
              <CardTitle className="text-balance mt-auto">
                {pizza.pizzaDescription}
              </CardTitle>
            </CardContent>

            <CardFooter className="flex flex-col gap-2">
              <EditPizza pizzaId={pizza.id} />
              <ChangeMenu
                pizzaId={pizza.id}
                isAvailableOnMenu={pizza.isAvailableOnMenu}
              />
              <DeletePizza pizzaId={pizza.id} />

              <PizzaImageBtn pizzaId={pizza.id} />
            </CardFooter>
          </Card>
        </li>
      ))}
    </ul>
  );
}
