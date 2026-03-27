import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

export function getCurrentError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return {
      type: "Prisma",
      code: error.code,
      meta: error.meta || {},
    };
  } else if (error instanceof ZodError) {
    return {
      type: "Zod",
      errors: error.format(),
    };
  } else if (error instanceof Error) {
    return {
      type: "Server",
      name: error.name,
      message: error.message,
    };
  } else {
    return {
      type: "Unknown",
      error,
    };
  }
}
