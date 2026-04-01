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
import { useEffect, useState } from "react";
import { CustomLoader } from "@/shared/Components/CustomLoader";
import CustomImage from "@/shared/Components/CustomImage";
import {
  type ImageFormInputType,
  type ImageFormOutputType,
  imageSchema,
} from "@/shared/Validation/ImageSchema";
import { uploadPizzaImageAction } from "../_actions/uploadPastaImageAction";
import { updatePizzaImageAction } from "../_actions/updatePastaImageAction";
import { getPizzaByIdAction } from "../_actions/getPizzaByIdAction";

export default function PizzaImageForm({ id }: { id: string }) {
  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<ImageFormInputType, unknown, ImageFormOutputType>({
    resolver: zodResolver(imageSchema),
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
    async function getImageById(id: string) {
      const response = await getPizzaByIdAction(id);

      if (!response.success || !response.data) {
        toast.error(response.message);
        return router.push(`/dashboard/pizzas`);
      }

      if (response.data.image) {
        setImage(response.data.image);
      }
    }

    getImageById(id);
  }, [id]);

  async function onSubmit(data: ImageFormOutputType) {
    if (image) {
      // update
      const response = await updatePizzaImageAction(
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
      router.push(`/dashboard/pizzas  `);
    } else {
      // create
      const response = await uploadPizzaImageAction(id, data.pizzaImage);

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      toast.success(response.message);
      reset();
      router.push(`/dashboard/pizzas`);
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
        <form id="image-form" onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <CustomImage
              control={control}
              name="pizzaImage"
              label="Pizza kép *"
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          className="w-full cursor-pointer"
          form="image-form"
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
