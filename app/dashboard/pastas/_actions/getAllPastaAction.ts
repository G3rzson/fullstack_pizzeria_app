"use server";

import { getAllPastaDal } from "../_dal/pastaDal";

type FormattedPastaType = {
  id: string;
  pastaName: string;
  pastaPrice: number;
  pastaDescription: string;
  isAvailableOnMenu: boolean;
  publicId: string | null;
  originalName: string | null;
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

export async function getAllPastaAction(): Promise<ResponseType> {
  try {
    const pastasArray = await getAllPastaDal();

    const formattedPastas: FormattedPastaType[] = pastasArray.map((pasta) => ({
      id: pasta.id,
      pastaName: pasta.pastaName,
      pastaPrice: pasta.pastaPrice,
      pastaDescription: pasta.pastaDescription,
      isAvailableOnMenu: pasta.isAvailableOnMenu,
      publicId: pasta.image?.publicId || null,
      originalName: pasta.image?.originalName || null,
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
