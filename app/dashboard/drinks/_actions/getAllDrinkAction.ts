"use server";

import { getAllDrinkDal } from "../_dal/drinkDal";

type FormattedDrinkType = {
  id: string;
  drinkName: string;
  drinkPrice: number;
  isAvailableOnMenu: boolean;
  drinkId: string | null;
  publicId: string | null;
  originalName: string | null;
  publicUrl: string | null;
};

type ResponseType =
  | {
      success: true;
      data: FormattedDrinkType[];
    }
  | {
      success: false;
      message: string;
    };

export async function getAllDrinkAction(): Promise<ResponseType> {
  try {
    const drinksArray = await getAllDrinkDal();

    const formattedDrinks: FormattedDrinkType[] = drinksArray.map((drink) => ({
      id: drink.id,
      drinkName: drink.drinkName,
      drinkPrice: drink.drinkPrice,
      isAvailableOnMenu: drink.isAvailableOnMenu,
      publicId: drink.image?.publicId || null,
      originalName: drink.image?.originalName || null,
      publicUrl: drink.image?.publicUrl || null,
      drinkId: drink.image?.drinkId || null,
    }));

    return {
      success: true,
      data: formattedDrinks,
    };
  } catch (error) {
    console.error("Error fetching drinks:", error);
    return {
      success: false,
      message: "Hiba történt az italok lekérése során.",
    };
  }
}
