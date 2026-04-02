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
import { useEffect } from "react";
import { CustomLoader } from "@/shared/Components/CustomLoader";
import { createDrinkAction } from "../_actions/createDrinkAction";
import { updateDrinkAction } from "../_actions/updateDrinkAction";
import { type DrinkFormType, drinkSchema } from "../_validation/drinkSchema";
import { getDrinkByIdAction } from "../_actions/getDrinkByIdAction";

export default function DrinkForm({ id }: { id?: string }) {
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

  useEffect(() => {
    const fetchDrink = async () => {
      if (id) {
        const editingData = await getDrinkByIdAction(id);

        if (!editingData.success || !editingData.data) {
          toast.error(editingData.message);
          return;
        }

        reset({
          drinkName: editingData.data.drinkName,
          drinkPrice: editingData.data.drinkPrice,
          isAvailableOnMenu: editingData.data.isAvailableOnMenu,
        });
      }
    };

    fetchDrink();
  }, [id, reset]);

  async function onSubmit(data: DrinkFormType) {
    if (id) {
      // update
      const response = await updateDrinkAction(id, data);

      if (!response.success) {
        toast.error(
          response.message || "Hiba történt az ital frissítése során!",
        );
        return;
      }

      toast.success(response.message || "Ital sikeresen frissítve!");

      reset();
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
      reset();
      router.push("/dashboard/drinks");
    }
  }
  return (
    <Card className="w-full sm:max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{id ? "Ital szerkesztése" : "Új ital"}</CardTitle>
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
              isSubmitting={isSubmitting}
            />

            <CustomNumber
              control={control}
              name="drinkPrice"
              label="Ital ára *"
              placeholder="1190"
              isSubmitting={isSubmitting}
            />

            <CustomCheckbox
              control={control}
              name="isAvailableOnMenu"
              label="Elérhető legyen az étlapon ?"
              isSubmitting={isSubmitting}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          className="w-full cursor-pointer"
          form="drink-form"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <CustomLoader />
          ) : id ? (
            "Ital frissítése"
          ) : (
            "Ital létrehozása"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
