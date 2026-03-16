import z from "zod";
import { ACCEPTED_TYPES, MAX_FILE_SIZE } from "../Constants/Constants";

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

  publicId: z.string().optional(),

  originalName: z.string().optional(),

  publicUrl: z.string().optional(),

  pizzaImage: z
    .unknown()
    .transform((value) => toSingleFile(value))
    .refine((file) => file === null || ACCEPTED_TYPES.includes(file.type), {
      message: "Csak kép formátum engedélyezett!",
    })
    .refine((file) => file === null || file.size <= MAX_FILE_SIZE, {
      message: `Max ${MAX_FILE_SIZE / (1024 * 1024)} MB`,
    }),
});

export type PizzaFormInputType = z.input<typeof pizzaSchema>;
export type PizzaFormOutputType = z.output<typeof pizzaSchema>;

type FileListLike = {
  length: number;
  item: (index: number) => File | null;
};

function isFileListLike(value: unknown): value is FileListLike {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<FileListLike>;
  return (
    typeof candidate.length === "number" && typeof candidate.item === "function"
  );
}

function toSingleFile(value: unknown): File | null {
  if (typeof File !== "undefined" && value instanceof File) {
    if (value.size === 0 && value.name === "") return null;
    return value;
  }

  if (isFileListLike(value)) {
    if (value.length === 0) return null;
    return value.item(0);
  }

  return null;
}
