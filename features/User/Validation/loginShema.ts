import z from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(2, "Névnek legalább 2 karakternek kell lennie")
    .max(20, "Név nem lehet hosszabb 20 karakternél")
    .regex(/^[a-zA-Z0-9]+$/, "Csak betűk és számok lehetnek"),
  password: z
    .string()
    .min(6, "Jelszónak legalább 6 karakternek kell lennie")
    .max(20, "Jelszó nem lehet hosszabb 20 karakternél")
    .regex(/[A-Z]/, "Legyen benne nagybetű")
    .regex(/[a-z]/, "Legyen benne kisbetű")
    .regex(/[0-9]/, "Legyen benne szám"),
});

export type LoginFormType = z.infer<typeof loginSchema>;
