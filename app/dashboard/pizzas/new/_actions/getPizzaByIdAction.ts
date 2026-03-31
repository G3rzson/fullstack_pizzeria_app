import { getPizzaByIdDal } from "../_dal/pizzaDal";

export async function getPizzaByIdAction(pizzaId: string) {
  try {
    const pizza = await getPizzaByIdDal(pizzaId);

    if (!pizza) {
      return { success: false, message: "Pizza not found" };
    }

    return {
      success: true,
      message: "Pizza adatai sikeresen lekérve",
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
