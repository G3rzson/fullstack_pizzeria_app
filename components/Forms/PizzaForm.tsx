"use client";

import {
  pizzaFormSchema,
  type PizzaFormSchemaType,
} from "@/validation/pizzaFormValidator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormInput from "../Elements/FormInput";
import FormSubmitBtn from "../Elements/FormSubmitBtn";
import { createPizzaAction, updatePizzaAction } from "@/actions/pizzaActions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/*--------------------------------------------------------
  TODO: Pizza name uniqueness validation   
  ADD: who created, created at fields  
  ADD: Image field to db            
  --------------------------------------------------------*/

type Props = {
  pizzaObj?: {
    id: string;
    pizzaName: string;
    pizzaPrice32: string;
    pizzaPrice45: string;
    pizzaDescription: string;
  };
};

export default function PizzaForm({ pizzaObj }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PizzaFormSchemaType>({
    resolver: zodResolver(pizzaFormSchema),
    defaultValues: pizzaObj
      ? {
          pizzaName: pizzaObj.pizzaName,
          pizzaPrice32: pizzaObj.pizzaPrice32,
          pizzaPrice45: pizzaObj.pizzaPrice45,
          pizzaDescription: pizzaObj.pizzaDescription,
        }
      : undefined,
  });
  const router = useRouter();

  async function onSubmit(data: PizzaFormSchemaType) {
    if (pizzaObj) {
      // update existing pizza
      const response = await updatePizzaAction(pizzaObj.id, data);

      if (!response.success) {
        toast.error(response.message || "Error during pizza update!");
        return;
      }
      toast.success(response.message || "Pizza updated successfully!");
      reset();
      router.push("/pizzas");
      return;
    } else {
      // create new pizza
      const response = await createPizzaAction(data);

      if (!response.success) {
        toast.error(response.message || "Error during pizza creation!");
        return;
      }
      toast.success(response.message || "Pizza created successfully!");
      reset();
      router.push("/pizzas");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-8 sm:w-4/5 w-full h-fit mx-auto dark:bg-zinc-800 bg-zinc-200 p-4"
    >
      <FormInput
        placeholder="Pizza neve"
        register={register}
        type="text"
        registername="pizzaName"
        errors={errors}
      />

      <FormInput
        placeholder="32 cm pizza ára"
        register={register}
        type="text"
        registername="pizzaPrice32"
        errors={errors}
      />

      <FormInput
        placeholder="45 cm pizza ára"
        register={register}
        type="text"
        registername="pizzaPrice45"
        errors={errors}
      />

      <FormInput
        placeholder="Pizza leírása"
        register={register}
        type="textarea"
        registername="pizzaDescription"
        errors={errors}
      />

      <FormSubmitBtn isSubmitting={isSubmitting}>
        {pizzaObj ? "Pizza frissítése" : "Pizza hozzáadása"}
      </FormSubmitBtn>
    </form>
  );
}
