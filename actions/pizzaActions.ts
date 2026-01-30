"use server";

import { createPizzaDal, deletePizzaDal, getAllPizzaDal } from "@/dal/pizzaDal";
import { idValidator, pizzaFormSchema } from "@/validation/pizzaFormValidator";
import { revalidatePath } from "next/cache";

// create
export async function createPizzaAction(data: unknown) {
  // validation
  const validatedDataObj = pizzaFormSchema.safeParse(data);
  if (!validatedDataObj.success) {
    console.error("Validation failed", validatedDataObj.error);
    return { success: false, message: "Validation failed" };
  }

  // create pizza object
  const newPizzaObj = {
    pizzaName: validatedDataObj.data.pizzaName,
    pizzaPrice32: Number(validatedDataObj.data.pizzaPrice32),
    pizzaPrice45: Number(validatedDataObj.data.pizzaPrice45),
    pizzaDescription: validatedDataObj.data.pizzaDescription,
  };

  try {
    // call DAL to create pizza
    await createPizzaDal(newPizzaObj);
    return { success: true, message: "Pizza created successfully" };
  } catch (error) {
    return { success: false, message: "Database error" };
  }
}

// get all pizzas
export async function getAllPizzaAction() {
  try {
    const pizzaArray = await getAllPizzaDal();
    return { success: true, data: pizzaArray };
  } catch (error) {
    console.error("Error fetching pizzas:", error);
    return { success: false, message: "Database error" };
  }
}

// delete pizza
export async function deletePizzaAction(pizzaId: unknown) {
  const validIdObj = idValidator.safeParse({ id: pizzaId });
  if (!validIdObj.success) {
    return { success: false, message: "Invalid pizza ID" };
  }
  try {
    await deletePizzaDal(validIdObj.data.id);
    revalidatePath("/pizzas");
    return { success: true, message: "Pizza deleted successfully" };
  } catch (error) {
    return { success: false, message: "Database error" };
  }
}
