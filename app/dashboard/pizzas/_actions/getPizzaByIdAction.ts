import { hasPermission } from "@/shared/Functions/hasPermission";
import { getPizzaByIdDal } from "../_dal/pizzaDal";
import { idValidator } from "@/shared/Functions/idValidator";
import { type ActionResponseType, type PizzaType } from "@/shared/Types/types";

export async function getPizzaByIdAction(
  id: string,
): Promise<ActionResponseType<PizzaType>> {
  try {
    const permissionResult = await hasPermission();

    if (!permissionResult) {
      return {
        success: false,
        message: "Nincs jogosultságod ehhez a művelethez!",
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
      return { success: false, message: "Menü nem található!" };
    }

    const formattedPizza: PizzaType = {
      id: pizza.id,
      pizzaName: pizza.pizzaName,
      pizzaDescription: pizza.pizzaDescription,
      pizzaPrice32: pizza.pizzaPrice32,
      pizzaPrice45: pizza.pizzaPrice45,
      isAvailableOnMenu: pizza.isAvailableOnMenu,
      image: pizza.image
        ? {
            id: pizza.image.id,
            pizzaId: pizza.image.pizzaId,
            publicId: pizza.image.publicId,
            publicUrl: pizza.image.publicUrl,
            originalName: pizza.image.originalName,
          }
        : null,
      createdAt: pizza.createdAt.toISOString(),
      updatedAt: pizza.updatedAt.toISOString(),
    };

    return {
      success: true,
      message: "Sikeres lekérés!",
      data: formattedPizza,
    };
  } catch (error) {
    console.error("Error fetching pizza by ID:", error);
    return {
      success: false,
      message: "Hiba történt a lekérés során!",
    };
  }
}
