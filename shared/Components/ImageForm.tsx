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
import {
  type AdminDrinkDtoType,
  type AdminPastaDtoType,
  type AdminPizzaDtoType,
} from "../Types/types";
import { useState } from "react";

type Props = {
  returnUrl: string;
  menuObject: AdminPizzaDtoType | AdminPastaDtoType | AdminDrinkDtoType;
  updateImageAction: (
    id: string,
    image: File | null,
    publicId: string,
  ) => Promise<
    | {
        success: boolean;
        message: string;
        data?: undefined;
      }
    | {
        success: boolean;
        message: string;
        data: {} | null;
      }
  >;
  uploadImageAction: (
    id: string,
    image: File | null,
  ) => Promise<
    | {
        success: boolean;
        message: string;
        data?: undefined;
      }
    | {
        success: boolean;
        message: string;
        data: {} | null;
      }
  >;
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
    formState: { isSubmitting },
  } = useForm<ImageFormInputType, unknown, ImageFormOutputType>({
    resolver: zodResolver(imageSchema),
    defaultValues: {
      image: null,
    },
  });
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const isFormPending = isSubmitting || isRedirecting;

  async function onSubmit(data: ImageFormOutputType) {
    if (menuObject.image) {
      // update
      const response = await updateImageAction(
        menuObject.id,
        data.image,
        menuObject.image.publicId,
      );

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      toast.success(response.message);
      setIsRedirecting(true);
      router.push(returnUrl);
    } else {
      // create
      const response = await uploadImageAction(menuObject.id, data.image);

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      toast.success(response.message);
      setIsRedirecting(true);
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
            <CustomImage control={control} name="image" label="Kép *" />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          className="w-full cursor-pointer"
          form="image-form"
          disabled={isFormPending}
        >
          {isFormPending ? (
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
