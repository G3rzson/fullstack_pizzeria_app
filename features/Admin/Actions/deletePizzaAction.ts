"use server";

import { revalidatePath } from "next/cache";
import { deletePizzaDal } from "../Dal/pizza.dal";
import { deleteCloudinaryImage } from "@/features/Pizzas/Actions/Cloudinary/deleteCloudinaryImage";

export async function deletePizzaAction(
  pizzaId: string,
  publicId: string | null,
) {
  try {
    if (publicId) {
      await deleteCloudinaryImage(publicId);
    }
    await deletePizzaDal(pizzaId);

    revalidatePath("/pizzas");
    revalidatePath("/admin");
    return {
      success: true,
      message: "A pizza sikeresen törölve.",
    };
  } catch (error) {
    console.error("Error deleting pizza:", error);
    return {
      success: false,
      message: "Hiba történt a pizza törlése során.",
    };
  }
}
