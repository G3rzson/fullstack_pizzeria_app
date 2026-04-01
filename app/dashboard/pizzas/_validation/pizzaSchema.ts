import z from "zod";

export const pizzaSchema = z.object({
  pizzaName: z
    .string()
    .trim()
    .toLowerCase()
    .transform((str) => str.replace(/\s+/g, " "))
    .pipe(
      z
        .string()
        .min(1, "A pizza neve kötelező!")
        .max(20, "Max hossz 20 karakter!"),
    ),
  pizzaPrice32: z
    .number()
    .min(1, "A pizza ára kötelező!")
    .max(9999, "Az ár nem lehet nagyobb 9999-nél!"),
  pizzaPrice45: z
    .number()
    .min(1, "A pizza ára kötelező!")
    .max(9999, "Az ár nem lehet nagyobb 9999-nél!"),

  pizzaDescription: z
    .string()
    .trim()
    .transform((str) => str.replace(/\s+/g, " "))
    .pipe(
      z
        .string()
        .min(1, "A pizza leírása kötelező!")
        .max(100, "Leírás max 100 karakter!"),
    ),

  isAvailableOnMenu: z.boolean(),
});

export type PizzaFormType = z.infer<typeof pizzaSchema>;
