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
import CustomText from "@/shared/Components/CustomText";
import CustomCheckbox from "@/shared/Components/CustomCheckbox";
import { CustomLoader } from "@/shared/Components/CustomLoader";
import {
  checkoutSchema,
  type CheckoutSchemaType,
} from "../_validation/checkoutSchema";
import { saveAddressAction } from "../_actions/saveAddressAction";
import { useRouter } from "next/navigation";
import { AddressDtoType } from "@/shared/Types/types";
import { useEffect } from "react";
import { updateAddressAction } from "../_actions/updateAddressAction";
import { useCart } from "@/lib/cart/useCart";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";

export default function CheckoutForm({
  address,
  userId,
}: {
  address: AddressDtoType | null;
  userId: string | null;
}) {
  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<CheckoutSchemaType>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      postalCode: "",
      city: "",
      street: "",
      houseNumber: "",
      floor: "",
      saveAddress: false,
    },
  });
  const router = useRouter();
  const { setCartItems } = useCart();

  useEffect(() => {
    if (address) {
      reset({
        fullName: address.fullName,
        phoneNumber: address.phoneNumber,
        postalCode: address.postalCode,
        city: address.city,
        street: address.street,
        houseNumber: address.houseNumber,
        floor: address.floorAndDoor || "",
        saveAddress: false,
      });
    }
  }, [address, reset]);

  async function onSubmit(data: CheckoutSchemaType) {
    try {
      if (data.saveAddress && address === null && userId) {
        try {
          // create new address
          const response = await saveAddressAction(userId, data);
          toast.success(response.message);
        } catch (error) {
          toast.error(BACKEND_RESPONSE_MESSAGES.SERVER_ERROR);
        }
      } else if (data.saveAddress && address && userId) {
        try {
          // update existing address
          const response = await updateAddressAction(userId, data);
          toast.success(response.message);
        } catch (error) {
          toast.error(BACKEND_RESPONSE_MESSAGES.SERVER_ERROR);
        }
      }

      router.push("/payment");
      toast.success(BACKEND_RESPONSE_MESSAGES.SUCCESS);

      reset();
      setCartItems([]);
    } catch (err) {
      toast.error(BACKEND_RESPONSE_MESSAGES.SERVER_ERROR);
    }
  }

  return (
    <Card className="w-full sm:max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Rendelés véglegesítése</CardTitle>
        <CardDescription>
          Add meg a szállítási címedet a rendeléshez. A *-gal jelölt mezők
          kitöltése kötelező.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="checkout-form" onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <CustomText
              control={control}
              name="fullName"
              label="Teljes név *"
              placeholder="Kovács János"
              isSubmitting={isSubmitting}
            />

            <CustomText
              control={control}
              name="phoneNumber"
              label="Telefonszám *"
              placeholder="+36-30-123-4567"
              isSubmitting={isSubmitting}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CustomText
                control={control}
                name="postalCode"
                label="Irányítószám *"
                placeholder="1234"
                isSubmitting={isSubmitting}
              />

              <CustomText
                control={control}
                name="city"
                label="Város *"
                placeholder="Budapest"
                isSubmitting={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CustomText
                control={control}
                name="street"
                label="Utca *"
                placeholder="Fő utca"
                isSubmitting={isSubmitting}
              />

              <CustomText
                control={control}
                name="houseNumber"
                label="Házszám *"
                placeholder="12"
                isSubmitting={isSubmitting}
              />
            </div>

            <CustomText
              control={control}
              name="floor"
              label="Emelet/ajtó (opcionális)"
              placeholder="3. emelet 12."
              isSubmitting={isSubmitting}
            />

            {userId && (
              <CustomCheckbox
                control={control}
                name="saveAddress"
                label="Mentsd el ezeket az adatokat a gyorsabb rendeléshez"
                isSubmitting={isSubmitting}
              />
            )}
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          variant={"outline"}
          className="w-full cursor-pointer"
          form="checkout-form"
          disabled={isSubmitting}
        >
          {isSubmitting ? <CustomLoader /> : "Rendelés leadása"}
        </Button>
      </CardFooter>
    </Card>
  );
}
