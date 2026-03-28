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
import CustomEmail from "@/shared/Components/CustomEmail";
import CustomPassword from "@/shared/Components/CustomPassword";
import CustomText from "@/shared/Components/CustomText";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  registerSchema,
  type RegisterSchemaType,
} from "../_validation/registerSchema";
import { registerAction } from "../_actions/registerAction";
import { toast } from "sonner";
import { REGISTER_INFO } from "../_constants/info";

export default function RegisterForm() {
  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<RegisterSchemaType, unknown, RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });
  const router = useRouter();

  async function onSubmit(data: RegisterSchemaType) {
    try {
      const response = await registerAction(data);

      if (!response.success) {
        toast.error(response.message || REGISTER_INFO.error);
        return;
      }

      toast.success(response.message || REGISTER_INFO.success);
      router.push("/auth/login");
      reset();
    } catch (err) {
      toast.error(REGISTER_INFO.error);
      console.error(err);
    }
  }
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Regisztráció</CardTitle>
        <CardDescription className="mt-2">
          A *-al jelölt mezők kitöltése kötelező.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          aria-label="register-form"
          id="register-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-8"
        >
          <CustomText
            label="Felhasználónév *"
            name="username"
            placeholder="Írd be a neved!"
            control={control}
            isSubmitting={isSubmitting}
          />

          <CustomEmail
            label="Email *"
            name="email"
            placeholder="Írd be az email címed!"
            control={control}
            isSubmitting={isSubmitting}
          />

          <CustomPassword
            label="Jelszó *"
            name="password"
            placeholder="Írd be a jelszavad!"
            control={control}
            isSubmitting={isSubmitting}
          />
        </form>

        <div className="flex flex-row items-center justify-between mt-8">
          <p>Van már fiókod? </p>
          <Link
            href="/auth/login"
            className="hover:text-amber-800 text-amber-600 dark:text-amber-200 dark:hover:text-amber-300 transition-colors duration-300"
          >
            Jelentkezz be!
          </Link>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button
          type="submit"
          variant="outline"
          form="register-form"
          disabled={isSubmitting}
          className="w-full"
        >
          Regisztráció
        </Button>
      </CardFooter>
    </Card>
  );
}
