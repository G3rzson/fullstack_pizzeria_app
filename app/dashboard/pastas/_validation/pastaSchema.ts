import z from "zod";

export const pastaSchema = z.object({
  pastaName: z
    .string()
    .trim()
    .toLowerCase()
    .transform((str) => str.replace(/\s+/g, " "))
    .pipe(
      z
        .string()
        .min(1, "A tészta neve kötelező!")
        .max(20, "Max hossz 20 karakter!"),
    ),
  pastaPrice: z
    .number()
    .min(1, "A tészta ára kötelező!")
    .max(9999, "Az ár nem lehet nagyobb 9999-nél!"),

  pastaDescription: z
    .string()
    .trim()
    .transform((str) => str.replace(/\s+/g, " "))
    .pipe(
      z
        .string()
        .min(1, "A tészta leírása kötelező!")
        .max(100, "Leírás max 100 karakter!"),
    ),

  isAvailableOnMenu: z.boolean(),
});

export type PastaFormType = z.infer<typeof pastaSchema>;
