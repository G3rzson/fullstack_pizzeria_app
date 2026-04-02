"use server";

import { getAllAvailablePastaDal } from "../_dal/pastaDal";

type FormattedPastaType = {
  id: string;
  pastaName: string;
  pastaPrice: number;
  pastaDescription: string;
  publicUrl: string | null;
};

type ResponseType =
  | {
      success: true;
      data: FormattedPastaType[];
    }
  | {
      success: false;
      message: string;
    };

export async function getAllAvailablePastaAction(): Promise<ResponseType> {
  try {
    const pastasArray = await getAllAvailablePastaDal();

    const formattedPastas: FormattedPastaType[] = pastasArray.map((pasta) => ({
      id: pasta.id,
      pastaName: pasta.pastaName,
      pastaPrice: pasta.pastaPrice,
      pastaDescription: pasta.pastaDescription,
      publicUrl: pasta.image?.publicUrl || null,
    }));

    return {
      success: true,
      data: formattedPastas,
    };
  } catch (error) {
    console.error("Error fetching pastas:", error);
    return {
      success: false,
      message: "Hiba történt a pasták lekérése során.",
    };
  }
}
