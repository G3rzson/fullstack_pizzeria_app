import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllPizzaAction } from "../_actions/getAllPizzaAction";
import { Pizza } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function PizzaList() {
  const response = await getAllPizzaAction();

  if (!response.success)
    return (
      <div>Hiba történt a pizzák lekérése során! Próbáld újra később.</div>
    );

  const pizzasArray = response.data || [];

  if (pizzasArray.length === 0)
    return <div>Jelenleg nincs elérhető pizza.</div>;

  return (
    <ul className="w-full">
      {pizzasArray.map((pizza) => (
        <li key={pizza.id}>
          <Card className="h-full w-full">
            <div className="flex items-center justify-center h-30 w-30  lg:w-10 lg:h-10 pl-4">
              {pizza.publicUrl ? null : <Pizza className="w-full h-full" />}
            </div>

            <CardHeader>
              <CardAction>
                <Badge
                  className={`${pizza.isAvailableOnMenu ? "bg-green-500/20" : "bg-destructive/20"} text-foreground w-40`}
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
          </Card>
        </li>
      ))}
    </ul>
  );
}
