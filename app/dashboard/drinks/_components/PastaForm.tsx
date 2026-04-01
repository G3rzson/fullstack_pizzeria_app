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
import { useEffect } from "react";
import { CustomLoader } from "@/shared/Components/CustomLoader";
import { type PastaFormType, pastaSchema } from "../_validation/pastaSchema";
import { createPastaAction } from "../_actions/createPastaAction";
import { updatePastaAction } from "../_actions/updatePastaAction";
import { getPastaByIdAction } from "../_actions/getPastaByIdAction";

export default function PastaForm({ id }: { id?: string }) {
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
    const fetchPasta = async () => {
      if (id) {
        const editingData = await getPastaByIdAction(id);

        if (!editingData.success || !editingData.data) {
          toast.error(editingData.message);
          return;
        }

        reset({
          pastaName: editingData.data.pastaName,
          pastaPrice: editingData.data.pastaPrice,
          pastaDescription: editingData.data.pastaDescription,
          isAvailableOnMenu: editingData.data.isAvailableOnMenu,
        });
      }
    };

    fetchPasta();
  }, [id, reset]);

  async function onSubmit(data: PastaFormType) {
    if (id) {
      // update
      const response = await updatePastaAction(id, data);

      if (!response.success) {
        toast.error(
          response.message || "Hiba történt a pasta frissítése során!",
        );
        return;
      }

      toast.success(response.message || "Pasta sikeresen frissítve!");

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

      toast.success(response.message || "Pasta sikeresen létrehozva!");
      reset();
      router.push("/dashboard/pastas");
    }
  }
  return (
    <Card className="w-full sm:max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{id ? "Tészta szerkesztése" : "Új tészta"}</CardTitle>
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
          ) : id ? (
            "Tészta frissítése"
          ) : (
            "Tészta létrehozása"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
