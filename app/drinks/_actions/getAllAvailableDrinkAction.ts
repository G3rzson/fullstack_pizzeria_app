"use server";

import { getAllAvailableDrinkDal } from "../_dal/drinkDal";

export type FormattedDrinkType = {
  id: string;
  drinkName: string;
  drinkPrice: number;
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

export async function getAllAvailableDrinkAction(): Promise<ResponseType> {
  try {
    const drinksArray = await getAllAvailableDrinkDal();

    const formattedDrinks: FormattedDrinkType[] = drinksArray.map((drink) => ({
      id: drink.id,
      drinkName: drink.drinkName,
      drinkPrice: drink.drinkPrice,
      publicUrl: drink.image?.publicUrl || null,
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
