"use client";

import {
  registerUserSchema,
  RegisterUserSchemaType,
} from "@/validation/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormInput from "../Elements/FormInput";
import FormSubmitBtn from "../Elements/FormSubmitBtn";
import { registerUserAction } from "@/actions/userActions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterUserSchemaType>({
    resolver: zodResolver(registerUserSchema),
  });

  async function onSubmit(data: RegisterUserSchemaType) {
    const response = await registerUserAction(data);

    if (!response.success) {
      toast.error(response.message || "Sikertelen regisztráció!");
      return;
    }

    toast.success(response.message || "Sikeres regisztráció!");
    reset();
    router.push("/user/login");
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-zinc-900 w-80 mx-auto p-4 flex flex-col gap-4"
    >
      <FormInput
        placeholder="Felhasználónév"
        register={register}
        type="text"
        registername="username"
        errors={errors}
      />

      <FormInput
        register={register}
        registername="email"
        type="email"
        placeholder="Email"
        errors={errors}
      />

      <FormInput
        register={register}
        registername="password"
        type="password"
        placeholder="Jelszó"
        errors={errors}
      />

      <FormSubmitBtn isSubmitting={isSubmitting}>Regisztráció</FormSubmitBtn>
    </form>
  );
}
