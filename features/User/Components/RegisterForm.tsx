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
import CustomText from "@/shared/Components/CustomText";
import { RegisterFormType, registerSchema } from "../Validation/registerShema";
import CustomEmail from "@/shared/Components/CustomEmail";
import CustomPassword from "@/shared/Components/CustomPassword";
import { registerAction } from "../Actions/registerAction";

export default function RegisterForm() {
  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<RegisterFormType>({
    resolver: zodResolver(registerSchema),
  });
  const router = useRouter();

  async function onSubmit(data: RegisterFormType) {
    const response = await registerAction(data);

    if (!response.success) {
      toast.error(
        response.message || "Szerverhiba történt! Próbáld újra később.",
      );
      return;
    }

    toast.success(response.message || "Felhasználó sikeresen regisztrálva!");
    reset();
    router.push("/user/login");
  }

  return (
    <Card className="w-full sm:max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Regisztráció</CardTitle>
        <CardDescription>
          A *-gal jelölt mezők kitöltése kötelező.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="register-form" onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <CustomText
              control={control}
              name="username"
              label="Felhasználónév*"
              placeholder="Minta Péter"
            />

            <CustomEmail
              control={control}
              name="email"
              label="Email cím*"
              placeholder="minta@minta.com"
            />

            <CustomPassword
              control={control}
              name="password"
              label="Jelszó*"
              placeholder="Jelszó"
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          className="w-full cursor-pointer"
          form="register-form"
          disabled={isSubmitting}
        >
          {isSubmitting ? <CustomLoader /> : "Regisztráció"}
        </Button>
      </CardFooter>
    </Card>
  );
}
