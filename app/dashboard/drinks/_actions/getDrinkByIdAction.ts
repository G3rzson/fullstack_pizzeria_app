import { type ActionResponseType, type DrinkType } from "@/shared/Types/types";
import { getDrinkByIdDal } from "../_dal/drinkDal";
import { idValidator } from "@/shared/Functions/idValidator";
import { hasPermission } from "@/shared/Functions/hasPermission";

export async function getDrinkByIdAction(
  drinkId: string,
): Promise<ActionResponseType<DrinkType>> {
  try {
    const permissionResult = await hasPermission();

    if (!permissionResult) {
      return {
        success: false,
        message: "Nincs jogosultságod ehhez a művelethez!",
      };
    }

    const { success, data } = idValidator.safeParse({ id: drinkId });
    if (!success) {
      return {
        success: false,
        message: "Érvénytelen azonosító!",
      };
    }

    const drink = await getDrinkByIdDal(data.id);

    if (!drink) {
      return { success: false, message: "Drink not found" };
    }

    const formattedDrink: DrinkType = {
      id: drink.id,
      drinkName: drink.drinkName,
      drinkPrice: drink.drinkPrice,
      isAvailableOnMenu: drink.isAvailableOnMenu,
      image: drink.image
        ? {
            id: drink.image.id,
            drinkId: drink.image.drinkId,
            publicId: drink.image.publicId,
            publicUrl: drink.image.publicUrl,
            originalName: drink.image.originalName,
          }
        : null,
      createdAt: drink.createdAt.toISOString(),
      updatedAt: drink.updatedAt.toISOString(),
    };

    return {
      success: true,
      message: "Drink adatai sikeresen lekérve",
      data: formattedDrink,
    };
  } catch (error) {
    console.error("Error fetching drink by ID:", error);
    return {
      success: false,
      message: "Hiba történt a drink adatainak lekérése során.",
    };
  }
}
