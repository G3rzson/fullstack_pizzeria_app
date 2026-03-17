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
import CustomInput from "@/components/ui/CustomInput";
import { CustomLoader } from "@/components/ui/CustomLoader";
import {
  PizzaImageFormInputType,
  PizzaImageFormOutputType,
  pizzaImageSchema,
} from "../Validation/pizzaImageSchema";
import { uploadImageAction } from "../Actions/uploadImageAction";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { updateImageAction } from "../Actions/updateImageAction";
import { getPizzaByIdAction } from "../Actions/getPizzaByIdAction";

export default function PizzaImageForm({ id }: { id: string }) {
  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<PizzaImageFormInputType, unknown, PizzaImageFormOutputType>({
    resolver: zodResolver(pizzaImageSchema),
    defaultValues: {
      pizzaImage: null,
    },
  });
  const router = useRouter();
  const [image, setImage] = useState<{
    id: string;
    publicId: string;
    publicUrl: string;
    originalName: string;
  } | null>(null);

  useEffect(() => {
    async function getImageByPizzaId(id: string) {
      const response = await getPizzaByIdAction(id);

      if (!response.success || !response.data) {
        toast.error(
          response.message || "Szerverhiba történt! Próbáld újra később.",
        );
        return router.push("/admin/pizzas");
      }

      if (response.data.image) {
        setImage(response.data.image);
      }
    }

    getImageByPizzaId(id);
  }, [id]);

  async function onSubmit(data: PizzaImageFormOutputType) {
    if (image) {
      // update
      const response = await updateImageAction(
        id,
        data.pizzaImage,
        image.publicId,
      );

      if (!response.success) {
        toast.error(
          response.message || "Szerverhiba történt! Próbáld újra később.",
        );
        return;
      }

      toast.success(response.message || "Pizza kép sikeresen frissítve!");
      reset();
      router.push("/admin/pizzas");
    } else {
      // create
      const response = await uploadImageAction(id, data.pizzaImage);

      if (!response.success) {
        toast.error(
          response.message || "Szerverhiba történt! Próbáld újra később.",
        );
        return;
      }

      toast.success(response.message || "Pizza kép sikeresen feltöltve!");
      reset();
      router.push("/admin/pizzas");
    }
  }
  return (
    <Card className="w-full sm:max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Kép feltöltése</CardTitle>
        <CardDescription>
          A *-gal jelölt mezők kitöltése kötelező.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="pizza-form" onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <CustomInput
              control={control}
              name="pizzaImage"
              type="file"
              label="Pizza kép *"
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
          ) : image ? (
            "Kép frissítése"
          ) : (
            "Kép feltöltése"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
