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
import CustomPassword from "@/shared/Components/CustomPassword";
import { LoginFormType, loginSchema } from "../Validation/loginShema";
import { loginAction } from "../Actions/loginAction";

export default function LoginForm() {
  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
  });
  const router = useRouter();

  async function onSubmit(data: LoginFormType) {
    const response = await loginAction(data);

    if (!response.success) {
      toast.error(
        response.message || "Szerverhiba történt! Próbáld újra később.",
      );
      return;
    }

    toast.success(response.message || "Sikeres bejelentkezés!");
    reset();
    router.push("/pizzas");
  }

  return (
    <Card className="w-full sm:max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Bejelentkezés</CardTitle>
        <CardDescription>
          A *-gal jelölt mezők kitöltése kötelező.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="login-form" onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <CustomText
              control={control}
              name="username"
              label="Felhasználónév*"
              placeholder="Minta Péter"
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
          form="login-form"
          disabled={isSubmitting}
        >
          {isSubmitting ? <CustomLoader /> : "Bejelentkezés"}
        </Button>
      </CardFooter>
    </Card>
  );
}
