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
import {
  PizzaFormInputType,
  PizzaFormOutputType,
  pizzaSchema,
} from "../Validation/pizzaSchema";
import CustomInput from "@/components/ui/CustomInput";
import { createPizzaAction } from "../Actions/createPizza.action";
import { useRouter } from "next/navigation";

export default function PizzaForm() {
  const {
    handleSubmit,
    control,
    reset,
    setError,
    formState: { isSubmitting },
  } = useForm<PizzaFormInputType, unknown, PizzaFormOutputType>({
    resolver: zodResolver(pizzaSchema),
    defaultValues: {
      pizzaName: "",
      pizzaPrice32: undefined,
      pizzaPrice45: undefined,
      pizzaDescription: "",
      isAvailableOnMenu: false,
      pizzaImage: null,
    },
  });
  const router = useRouter();

  async function onSubmit(data: PizzaFormOutputType) {
    const response = await createPizzaAction(data);
    if (!response.success) {
      if (response.fieldErrors) {
        (
          Object.entries(response.fieldErrors) as [
            keyof PizzaFormInputType,
            string[] | undefined,
          ][]
        ).forEach(([field, messages]) => {
          setError(field, { message: messages?.[0] });
        });
      }
      return toast.error(response.message);
    }

    toast.success(response.message);
    reset();
    router.push("/pizzas");
  }

  return (
    <Card className="w-full sm:max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Új pizza</CardTitle>
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

            <CustomInput
              control={control}
              name="pizzaImage"
              type="file"
              label="Pizza kép (opcionális)"
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          className="w-full"
          form="pizza-form"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Mentés..." : "Pizza létrehozása"}
        </Button>
      </CardFooter>
    </Card>
  );
}
