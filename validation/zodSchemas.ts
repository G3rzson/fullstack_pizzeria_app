import { z } from "zod";

export const registerUserSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must be at most 20 characters long"),
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .transform((value) => value.toLowerCase()),
  password: z.string().min(4, "Password must be at least 4 characters long"),
});

export const loginUserSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must be at most 20 characters long"),
  password: z.string().min(4, "Password must be at least 4 characters long"),
});

export type RegisterUserSchemaType = z.infer<typeof registerUserSchema>;
export type LoginUserSchemaType = z.infer<typeof loginUserSchema>;
