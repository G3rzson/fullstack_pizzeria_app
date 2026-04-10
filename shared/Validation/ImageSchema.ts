import z from "zod";
import { ACCEPTED_TYPES } from "../Constants/constants";
import { MAX_FILE_SIZE } from "../Constants/constants";
import { toSingleFile } from "../Functions/fileHelpers";

export const imageSchema = z.object({
  image: z
    .unknown()
    .transform((value) => toSingleFile(value))
    .refine((file) => file === null || ACCEPTED_TYPES.includes(file.type), {
      message: "Csak kép formátum engedélyezett!",
    })
    .refine((file) => file === null || file.size <= MAX_FILE_SIZE, {
      message: `Max ${MAX_FILE_SIZE / (1024 * 1024)} MB`,
    }),
});

export type ImageFormInputType = z.input<typeof imageSchema>;
export type ImageFormOutputType = z.output<typeof imageSchema>;
