import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .transform((str) => str.replace(/\s+/g, " "))
    .pipe(
      z.string().min(1, "A név kötelező!").max(30, "Max hossz 30 karakter!"),
    ),
  email: z
    .string()
    .email("Érvénytelen email cím!")
    .transform((val) => val.toLowerCase()),
  password: z
    .string()
    .min(6, "A jelszónak legalább 6 karakter hosszúnak kell lennie!")
    .max(20, "A jelszó nem lehet hosszabb 20 karakternél!")
    .refine((val) => /[a-z]/.test(val), {
      message: "A jelszónak tartalmaznia kell kisbetűt",
    })
    .refine((val) => /[A-Z]/.test(val), {
      message: "A jelszónak tartalmaznia kell nagybetűt",
    })
    .refine((val) => /\d/.test(val), {
      message: "A jelszónak tartalmaznia kell számot",
    })
    .refine((val) => /^[A-Za-z\d]+$/.test(val), {
      message: "A jelszó nem tartalmazhat speciális karaktert",
    }),
});

export type RegisterSchemaType = z.infer<typeof registerSchema>;
