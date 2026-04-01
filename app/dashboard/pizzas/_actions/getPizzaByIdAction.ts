import { hasPermission } from "@/shared/Functions/hasPermission";
import { getPizzaByIdDal } from "../_dal/pizzaDal";
import { idValidator } from "@/shared/Functions/idValidator";

export async function getPizzaByIdAction(id: string) {
  try {
    const permissionResult = await hasPermission();

    if (!permissionResult) {
      return {
        success: false,
        message: "Nincs jogosultságod a törléshez!",
      };
    }

    const { success, data } = idValidator.safeParse({ id });
    if (!success) {
      return {
        success: false,
        message: "Érvénytelen azonosító!",
      };
    }

    const pizza = await getPizzaByIdDal(data.id);

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
