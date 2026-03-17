"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { PizzaFormType, pizzaSchema } from "../Validation/pizzaSchema";
import CustomInput from "@/components/ui/CustomInput";
import { createPizzaAction } from "../Actions/createPizzaAction";
import { useRouter } from "next/navigation";
import { CustomLoader } from "@/components/ui/CustomLoader";
import { useEffect } from "react";
import { getPizzaByIdAction } from "@/features/Admin/Actions/getPizzaByIdAction";
import { updatePizzaAction } from "@/features/Admin/Actions/updatePizzaAction";

export default function PizzaForm({ id }: { id?: string }) {
  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<PizzaFormType>({
    resolver: zodResolver(pizzaSchema),
    defaultValues: {
      pizzaName: "",
      pizzaPrice32: undefined,
      pizzaPrice45: undefined,
      pizzaDescription: "",
      isAvailableOnMenu: false,
    },
  });
  const router = useRouter();

  useEffect(() => {
    const fetchPizza = async () => {
      if (id) {
        const editingData = await getPizzaByIdAction(id);

        if (!editingData.success || !editingData.data) {
          return;
        }

        if (editingData.success) {
          reset({
            pizzaName: editingData.data.pizzaName,
            pizzaPrice32: editingData.data.pizzaPrice32,
            pizzaPrice45: editingData.data.pizzaPrice45,
            pizzaDescription: editingData.data.pizzaDescription,
            isAvailableOnMenu: editingData.data.isAvailableOnMenu,
          });
        }
      }
    };

    fetchPizza();
  }, [id, reset]);

  async function onSubmit(data: PizzaFormType) {
    if (id) {
      // update
      const response = await updatePizzaAction(id, data);

      if (!response.success) {
        toast.error(
          response.message || "Hiba történt a pizza frissítése során!",
        );
        return;
      }

      toast.success(response.message || "Pizza sikeresen frissítve!");

      reset();
      router.push("/admin/pizzas");
    } else {
      // create
      const response = await createPizzaAction(data);

      if (!response.success) {
        toast.error(
          response.message || "Szerverhiba történt! Próbáld újra később.",
        );
        return;
      }

      toast.success(response.message || "Pizza sikeresen létrehozva!");
      reset();
      router.push("/admin/pizzas");
    }
  }

  return (
    <Card className="w-full sm:max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{id ? "Pizza szerkesztése" : "Új pizza"}</CardTitle>
        <CardDescription>
          A *-gal jelölt mezők kitöltése kötelező.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="pizza-form" onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <CustomInput
              control={control}
              name="pizzaName"
              type="text"
              label="Pizza neve *"
              placeholder="Margherita, Pepperoni etc."
            />

            <CustomInput
              control={control}
              name="pizzaPrice32"
              type="number"
              label="32 cm-es pizza ára *"
              placeholder="1190"
            />
            <CustomInput
              control={control}
              name="pizzaPrice45"
              type="number"
              label="45 cm-es pizza ára *"
              placeholder="1590"
            />

            <CustomInput
              control={control}
              name="pizzaDescription"
              type="textarea"
              label="Pizza leírása *"
              placeholder="Rövid leírás az alapanyagokról és ízvilágról"
            />

            <CustomInput
              control={control}
              name="isAvailableOnMenu"
              type="checkbox"
              label="Elérhető legyen az étlapon ?"
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          className="w-full cursor-pointer"
          form="pizza-form"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <CustomLoader />
          ) : id ? (
            "Pizza szerkesztése"
          ) : (
            "Pizza létrehozása"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
