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
import { createPizzaAction } from "../Actions/createPizzaAction";
import { useRouter } from "next/navigation";
import { CustomLoader } from "@/shared/Components/CustomLoader";
import { useEffect } from "react";
import { getPizzaByIdAction } from "@/features/Admin/Actions/getPizzaByIdAction";
import { updatePizzaAction } from "@/features/Admin/Actions/updatePizzaAction";
import CustomCheckbox from "@/shared/Components/CustomCheckbox";
import CustomTextarea from "@/shared/Components/CustomTextarea";
import CustomNumber from "@/shared/Components/CustomNumber";
import CustomText from "@/shared/Components/CustomText";

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
            <CustomText
              control={control}
              name="pizzaName"
              label="Pizza neve *"
              placeholder="Margherita, Pepperoni etc."
            />

            <CustomNumber
              control={control}
              name="pizzaPrice32"
              label="32 cm-es pizza ára *"
              placeholder="1190"
            />
            <CustomNumber
              control={control}
              name="pizzaPrice45"
              label="45 cm-es pizza ára *"
              placeholder="1590"
            />

            <CustomTextarea
              control={control}
              name="pizzaDescription"
              label="Pizza leírása *"
              placeholder="Rövid leírás az alapanyagokról és ízvilágról"
            />

            <CustomCheckbox
              control={control}
              name="isAvailableOnMenu"
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
