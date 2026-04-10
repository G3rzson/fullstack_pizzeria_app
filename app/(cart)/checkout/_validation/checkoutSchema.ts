import z from "zod";

export const checkoutSchema = z.object({
  fullName: z
    .string()
    .trim()
    .transform((str) => str.replace(/\s+/g, " "))
    .pipe(
      z
        .string()
        .min(1, "A teljes név kötelező!")
        .max(50, "Max hossz 50 karakter!"),
    ),
  phoneNumber: z
    .string()
    .trim()
    .min(1, "A telefonszám kötelező!")
    .regex(
      /^[\d\s\-\+\(\)]+$/,
      "A telefonszám csak számokat és a következő karaktereket tartalmazhatja: +, -, (, ), szóköz",
    )
    .transform((str) => str.replace(/\s+/g, ""))
    .pipe(
      z
        .string()
        .min(9, "A telefonszám legalább 9 karakter!")
        .max(15, "A telefonszám maximum 15 karakter!"),
    ),
  postalCode: z
    .string()
    .trim()
    .min(1, "Az irányítószám kötelező!")
    .regex(/^\d{4}$/, "Az irányítószám 4 számjegyből áll!"),
  city: z
    .string()
    .trim()
    .transform((str) => str.replace(/\s+/g, " "))
    .pipe(
      z
        .string()
        .min(1, "A város neve kötelező!")
        .max(50, "Max hossz 50 karakter!"),
    ),
  street: z
    .string()
    .trim()
    .transform((str) => str.replace(/\s+/g, " "))
    .pipe(
      z
        .string()
        .min(1, "Az utca neve kötelező!")
        .max(50, "Max hossz 50 karakter!"),
    ),
  houseNumber: z
    .string()
    .trim()
    .min(1, "A házszám kötelező!")
    .max(10, "Max hossz 10 karakter!"),
  floor: z
    .string()
    .trim()
    .transform((str) => str.replace(/\s+/g, " "))
    .optional(),
  saveAddress: z.boolean(),
});

export type CheckoutSchemaType = z.infer<typeof checkoutSchema>;
