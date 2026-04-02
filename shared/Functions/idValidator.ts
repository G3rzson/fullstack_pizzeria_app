import z from "zod";

export const idValidator = z.object({
  id: z.string().uuid("Érvénytelen azonosító!"),
});
