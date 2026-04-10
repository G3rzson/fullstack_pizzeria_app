"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CustomPassword from "@/shared/Components/CustomPassword";
import CustomText from "@/shared/Components/CustomText";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { loginSchema, type LoginSchemaType } from "../_validation/loginSchema";
import { loginAction } from "../_actions/loginAction";
import { useAuth } from "@/lib/auth/useAuth";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";
import { useState } from "react";

function normalizeCallbackUrl(callbackUrl: string | null) {
  if (!callbackUrl || !callbackUrl.startsWith("/")) {
    return "/";
  }

  return callbackUrl;
}

export default function LoginForm() {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const isFormPending = isSubmitting || isRedirecting;

  async function onSubmit(data: LoginSchemaType) {
    try {
      const response = await loginAction(data);

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      // Fetch user data after successful login
      await refreshUser();

      const callbackUrl = normalizeCallbackUrl(searchParams.get("callbackUrl"));

      toast.success(response.message);
      setIsRedirecting(true);
      router.push(callbackUrl);
    } catch (err) {
      toast.error(BACKEND_RESPONSE_MESSAGES.SERVER_ERROR);
      console.error(err);
    }
  }
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Bejelentkezés</CardTitle>
        <CardDescription className="mt-2">
          A *-al jelölt mezők kitöltése kötelező.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          aria-label="login-form"
          id="login-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex w-full flex-col gap-8"
        >
          <CustomText
            label="Felhasználónév *"
            name="username"
            placeholder="Írd be a neved!"
            control={control}
            isSubmitting={isFormPending}
          />

          <CustomPassword
            label="Jelszó *"
            name="password"
            placeholder="Írd be a jelszavad!"
            control={control}
            isSubmitting={isFormPending}
          />
        </form>

        <div className="flex flex-row items-center justify-between mt-8">
          <p>Még nincs fiókod? </p>
          <Link
            href="/auth/register"
            className="hover:text-amber-800 text-amber-600 dark:text-amber-200 dark:hover:text-amber-300 transition-colors duration-300"
          >
            Regisztrálj!
          </Link>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button
          type="submit"
          variant="outline"
          form="login-form"
          disabled={isFormPending}
          className="w-full"
        >
          Bejelentkezés
        </Button>
      </CardFooter>
    </Card>
  );
}
