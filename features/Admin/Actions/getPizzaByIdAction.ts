import { getPizzaByIdDal } from "../Dal/pizzaDal";
import { requireAdmin } from "@/lib/requireAdmin";

export async function getPizzaByIdAction(pizzaId: string) {
  await requireAdmin();
  try {
    const pizza = await getPizzaByIdDal(pizzaId);

    if (!pizza) {
      return { success: false, message: "Pizza not found" };
    }

    return {
      success: true,
      data: pizza,
    };
  } catch (error) {
    console.error("Error fetching pizza by ID:", error);
    return {
      success: false,
      message: "Hiba történt a pizza adatainak lekérése során.",
    };
  }
}
