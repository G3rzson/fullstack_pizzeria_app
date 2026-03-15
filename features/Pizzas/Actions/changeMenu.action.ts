"use server";
import { revalidatePath } from "next/cache";
import { changeMenuDal } from "../Dal/pizza.dal";

export async function changeMenuAction(
  pizzaId: string,
  isAvailableOnMenu: boolean,
) {
  try {
    await changeMenuDal(pizzaId, isAvailableOnMenu);

    revalidatePath("/pizzas");
    return {
      success: true,
      message: "Az étlap státusza sikeresen megváltozott.",
    };
  } catch (error) {
    console.error("Error changing menu status:", error);
    return {
      success: false,
      message: "Hiba történt az étlap státuszának megváltoztatása során.",
    };
  }
}
