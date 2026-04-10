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
import { useRouter } from "next/navigation";
import CustomText from "@/shared/Components/CustomText";
import CustomNumber from "@/shared/Components/CustomNumber";
import CustomCheckbox from "@/shared/Components/CustomCheckbox";
import { CustomLoader } from "@/shared/Components/CustomLoader";
import { createDrinkAction } from "../_actions/createDrinkAction";
import { updateDrinkAction } from "../_actions/updateDrinkAction";
import { type DrinkFormType, drinkSchema } from "../_validation/drinkSchema";
import { useEffect, useState } from "react";
import { type AdminDrinkDtoType } from "@/shared/Types/types";

export default function DrinkForm({
  drinkObject,
}: {
  drinkObject?: AdminDrinkDtoType;
}) {
  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<DrinkFormType>({
    resolver: zodResolver(drinkSchema),
    defaultValues: {
      drinkName: "",
      drinkPrice: undefined,
      isAvailableOnMenu: false,
    },
  });
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const isFormPending = isSubmitting || isRedirecting;

  useEffect(() => {
    if (drinkObject) {
      reset({
        drinkName: drinkObject.drinkName,
        drinkPrice: drinkObject.drinkPrice,
        isAvailableOnMenu: drinkObject.isAvailableOnMenu,
      });
    }
  }, [drinkObject, reset]);

  async function onSubmit(data: DrinkFormType) {
    if (drinkObject) {
      // update
      const response = await updateDrinkAction(drinkObject.id, data);

      if (!response.success) {
        toast.error(
          response.message || "Hiba történt az ital frissítése során!",
        );
        return;
      }

      toast.success(response.message || "Ital sikeresen frissítve!");
      setIsRedirecting(true);
      router.push("/dashboard/drinks");
    } else {
      // create
      const response = await createDrinkAction(data);

      if (!response.success) {
        toast.error(
          response.message || "Szerverhiba történt! Próbáld újra később.",
        );
        return;
      }

      toast.success(response.message || "Ital sikeresen létrehozva!");
      setIsRedirecting(true);
      router.push("/dashboard/drinks");
    }
  }
  return (
    <Card className="w-full sm:max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{drinkObject ? "Ital szerkesztése" : "Új ital"}</CardTitle>
        <CardDescription>
          A *-gal jelölt mezők kitöltése kötelező.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="drink-form" onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <CustomText
              control={control}
              name="drinkName"
              label="Ital neve *"
              placeholder="Cola, Fanta etc."
              isSubmitting={isFormPending}
            />

            <CustomNumber
              control={control}
              name="drinkPrice"
              label="Ital ára *"
              placeholder="1190"
              isSubmitting={isFormPending}
            />

            <CustomCheckbox
              control={control}
              name="isAvailableOnMenu"
              label="Elérhető legyen az étlapon ?"
              isSubmitting={isFormPending}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          className="w-full cursor-pointer"
          form="drink-form"
          disabled={isFormPending}
        >
          {isFormPending ? (
            <CustomLoader />
          ) : drinkObject ? (
            "Ital frissítése"
          ) : (
            "Ital létrehozása"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
