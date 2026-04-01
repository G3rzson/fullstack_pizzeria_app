import { getPastaByIdDal } from "../_dal/pastaDal";

export async function getPastaByIdAction(pastaId: string) {
  try {
    const pasta = await getPastaByIdDal(pastaId);

    if (!pasta) {
      return { success: false, message: "Pasta not found" };
    }

    return {
      success: true,
      message: "Pasta adatai sikeresen lekérve",
      data: pasta,
    };
  } catch (error) {
    console.error("Error fetching pasta by ID:", error);
    return {
      success: false,
      message: "Hiba történt a pasta adatainak lekérése során.",
    };
  }
}
