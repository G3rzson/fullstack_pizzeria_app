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
import { CustomLoader } from "@/shared/Components/CustomLoader";
import CustomImage from "@/shared/Components/CustomImage";
import {
  type ImageFormInputType,
  type ImageFormOutputType,
  imageSchema,
} from "@/shared/Validation/ImageSchema";
import { type MenuObjectType, type SimpleResponseType } from "../Types/types";

type Props = {
  returnUrl: string;
  menuObject: MenuObjectType;
  updateImageAction: (
    id: string,
    image: File | null,
    publicId: string,
  ) => Promise<SimpleResponseType>;
  uploadImageAction: (
    id: string,
    image: File | null,
  ) => Promise<SimpleResponseType>;
};

export default function ImageForm({
  returnUrl,
  menuObject,
  updateImageAction,
  uploadImageAction,
}: Props) {
  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<ImageFormInputType, unknown, ImageFormOutputType>({
    resolver: zodResolver(imageSchema),
    defaultValues: {
      image: null,
    },
  });
  const router = useRouter();

  async function onSubmit(data: ImageFormOutputType) {
    if (menuObject.image) {
      // update
      const response = await updateImageAction(
        menuObject.id,
        data.image,
        menuObject.image.publicId,
      );

      if (!response.success) {
        toast.error(
          response.message || "Szerverhiba történt! Próbáld újra később.",
        );
        return;
      }

      toast.success(response.message || "Kép sikeresen frissítve!");
      reset();
      router.push(returnUrl);
    } else {
      // create
      const response = await uploadImageAction(menuObject.id, data.image);

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      toast.success(response.message);
      reset();
      router.push(returnUrl);
    }
  }
  return (
    <Card className="w-full sm:max-w-md mx-auto">
      <CardHeader>
        <CardTitle>
          {menuObject.image ? "Kép frissítése" : "Kép feltöltése"}
        </CardTitle>
        <CardDescription>
          A *-gal jelölt mezők kitöltése kötelező.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="image-form" onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <CustomImage control={control} name="image" label="Pizza kép *" />
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
          ) : menuObject.image ? (
            "Kép frissítése"
          ) : (
            "Kép feltöltése"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
