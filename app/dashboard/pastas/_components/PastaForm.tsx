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
import CustomTextarea from "@/shared/Components/CustomTextarea";
import CustomCheckbox from "@/shared/Components/CustomCheckbox";
import { CustomLoader } from "@/shared/Components/CustomLoader";
import { type PastaFormType, pastaSchema } from "../_validation/pastaSchema";
import { createPastaAction } from "../_actions/createPastaAction";
import { updatePastaAction } from "../_actions/updatePastaAction";
import { PastaType } from "@/shared/Types/types";
import { useEffect } from "react";

export default function PastaForm({
  pastaObject,
}: {
  pastaObject?: PastaType;
}) {
  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<PastaFormType>({
    resolver: zodResolver(pastaSchema),
    defaultValues: {
      pastaName: "",
      pastaPrice: undefined,
      pastaDescription: "",
      isAvailableOnMenu: false,
    },
  });
  const router = useRouter();

  useEffect(() => {
    if (pastaObject) {
      reset({
        pastaName: pastaObject.pastaName,
        pastaPrice: pastaObject.pastaPrice,
        pastaDescription: pastaObject.pastaDescription,
        isAvailableOnMenu: pastaObject.isAvailableOnMenu,
      });
    }
  }, [pastaObject, reset]);

  async function onSubmit(data: PastaFormType) {
    if (pastaObject) {
      // update
      const response = await updatePastaAction(pastaObject.id, data);

      if (!response.success) {
        toast.error(
          response.message || "Hiba történt a tészta frissítése során!",
        );
        return;
      }

      toast.success(response.message || "Tészta sikeresen frissítve!");

      reset();
      router.push("/dashboard/pastas");
    } else {
      // create
      const response = await createPastaAction(data);

      if (!response.success) {
        toast.error(
          response.message || "Szerverhiba történt! Próbáld újra később.",
        );
        return;
      }

      toast.success(response.message || "Tészta sikeresen létrehozva!");
      reset();
      router.push("/dashboard/pastas");
    }
  }
  return (
    <Card className="w-full sm:max-w-md mx-auto">
      <CardHeader>
        <CardTitle>
          {pastaObject ? "Tészta szerkesztése" : "Új tészta"}
        </CardTitle>
        <CardDescription>
          A *-gal jelölt mezők kitöltése kötelező.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="pasta-form" onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <CustomText
              control={control}
              name="pastaName"
              label="Tészta neve *"
              placeholder="Spaghetti, Penne etc."
              isSubmitting={isSubmitting}
            />

            <CustomNumber
              control={control}
              name="pastaPrice"
              label="Tészta ára *"
              placeholder="1190"
              isSubmitting={isSubmitting}
            />

            <CustomTextarea
              control={control}
              name="pastaDescription"
              label="Tészta leírása *"
              placeholder="Rövid leírás az alapanyagokról és ízvilágról"
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
          form="pasta-form"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <CustomLoader />
          ) : pastaObject ? (
            "Tészta frissítése"
          ) : (
            "Tészta létrehozása"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
