import z from "zod";

export const drinkSchema = z.object({
  drinkName: z
    .string()
    .trim()
    .toLowerCase()
    .transform((str) => str.replace(/\s+/g, " "))
    .pipe(
      z
        .string()
        .min(1, "A ital neve kötelező!")
        .max(20, "Max hossz 20 karakter!"),
    ),
  drinkPrice: z
    .number()
    .min(1, "Az ital ára kötelező!")
    .max(9999, "Az ár nem lehet nagyobb 9999-nél!"),

  isAvailableOnMenu: z.boolean(),
});

export type DrinkFormType = z.infer<typeof drinkSchema>;
