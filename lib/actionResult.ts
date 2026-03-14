import type { ZodError } from "zod";

export type ActionResult<
  TFieldValues extends Record<string, unknown> = Record<string, unknown>,
> = {
  success: boolean;
  message: string;
  fieldErrors?: Partial<Record<keyof TFieldValues, string[]>>;
};

export function okResult(message: string): ActionResult {
  return { success: true, message };
}

export function validationErrorResult<T extends Record<string, unknown>>(
  error: ZodError<T>,
  message = "Érvénytelen adatok. Kérem, ellenőrizze a megadott információkat.",
): ActionResult<T> {
  return {
    success: false,
    message,
    fieldErrors: error.flatten().fieldErrors as Partial<
      Record<keyof T, string[]>
    >,
  };
}

export function serverErrorResult(
  message = "Szerverhiba. Próbáld újra később!",
): ActionResult {
  return { success: false, message };
}
