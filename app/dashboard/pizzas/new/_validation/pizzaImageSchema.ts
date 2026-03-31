import z from "zod";
import { ACCEPTED_TYPES } from "../_constants/constants";
import { MAX_FILE_SIZE } from "../_constants/constants";

export const pizzaImageSchema = z.object({
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

export type PizzaImageFormInputType = z.input<typeof pizzaImageSchema>;
export type PizzaImageFormOutputType = z.output<typeof pizzaImageSchema>;

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
