import { z } from "zod";

export const pizzaFormSchema = z.object({
  pizzaName: z
    .string()
    .trim()
    .min(1, "Text is required")
    .max(20, "Text must be at most 20 characters"),
  pizzaDescription: z
    .string()
    .trim()
    .min(1, "Text is required")
    .max(50, "Text must be at most 50 characters"),
  pizzaPrice32: z
    .string()
    .min(1, "Price is required")
    .max(4, "Price must be at most 4 characters")
    .refine((val) => !isNaN(Number(val)), {
      message: "Only numbers are allowed",
    }),
  pizzaPrice45: z
    .string()
    .min(1, "Price is required")
    .max(4, "Price must be at most 4 characters")
    .refine((val) => !isNaN(Number(val)), {
      message: "Only numbers are allowed",
    }),
});

export const idValidator = z.object({
  id: z.string().uuid("Invalid ID format"),
});

export type PizzaFormSchemaType = z.infer<typeof pizzaFormSchema>;
export type IdValidatorType = z.infer<typeof idValidator>;
