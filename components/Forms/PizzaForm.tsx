"use client";

import {
  pizzaFormSchema,
  type PizzaFormSchemaType,
} from "@/validation/pizzaFormValidator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormInput from "../Elements/FormInput";
import FormSubmitBtn from "../Elements/FormSubmitBtn";
import { createPizzaAction } from "@/actions/pizzaActions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

/*--------------------------------------------------------
  TODO: Pizza name uniqueness validation   
  ADD: who created, created at fields  
  ADD: Image field to db            
  --------------------------------------------------------*/

export default function PizzaForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PizzaFormSchemaType>({
    resolver: zodResolver(pizzaFormSchema),
  });
  const router = useRouter();

  async function onSubmit(data: PizzaFormSchemaType) {
    const response = await createPizzaAction(data);

    if (!response.success) {
      toast.error(response.message || "Error during pizza creation!");
      return;
    }
    toast.success("Pizza created successfully!");
    reset();
    router.push("/pizzas");
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
        Pizza hozzáadása
      </FormSubmitBtn>
    </form>
  );
}
