"use client";

import {
  pizzaFormSchema,
  type PizzaFormSchemaType,
} from "@/validation/pizzaFormValidator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormInput from "../Elements/FormInput";
import FormRadioBtn from "../Elements/FormRadioBtn";
import FormSubmitBtn from "../Elements/FormSubmitBtn";

export default function PizzaForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PizzaFormSchemaType>({
    resolver: zodResolver(pizzaFormSchema),
  });

  async function onSubmit(data: PizzaFormSchemaType) {
    console.log(data);
    reset();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-8 sm:w-4/5 w-full mx-auto dark:bg-zinc-800 bg-zinc-200 p-4"
    >
      <FormInput
        placeholder="Pizza neve"
        register={register}
        type="text"
        registername="pizzaName"
        errors={errors}
      />

      <FormInput
        placeholder="Pizza leírása"
        register={register}
        type="textarea"
        registername="pizzaDescription"
        errors={errors}
      />

      <FormRadioBtn
        register={register}
        registername="pizzaSize"
        errors={errors}
      />

      <FormInput
        placeholder="Pizza ára"
        register={register}
        type="text"
        registername="pizzaPrice"
        errors={errors}
      />

      <FormSubmitBtn isSubmitting={isSubmitting}>
        Pizza hozzáadása
      </FormSubmitBtn>
    </form>
  );
}
