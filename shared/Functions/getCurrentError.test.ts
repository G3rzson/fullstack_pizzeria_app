import { describe, it, expect } from "vitest";
import { getCurrentError } from "./getCurrentError";
import { Prisma } from "@prisma/client";
import { z } from "zod";

describe("getCurrentError", () => {
  it("should return correct error object for PrismaClientKnownRequestError", () => {
    // Prisma error példány létrehozása
    const prismaError = new Prisma.PrismaClientKnownRequestError(
      "Unique constraint failed",
      {
        code: "P2002",
        clientVersion: "5.0.0",
        meta: { target: ["email"] },
      },
    );
    const result = getCurrentError(prismaError);
    expect(result).toEqual({
      type: "Prisma",
      code: "P2002",
      meta: { target: ["email"] },
    });
  });

  it("should return correct error object for ZodError", () => {
    // ZodError példány létrehozása validációval
    const schema = z.object({
      email: z.string().email("Invalid email"),
    });

    try {
      schema.parse({ email: "rossz_email" });
      throw new Error("Should have thrown validation error");
    } catch (error) {
      const result = getCurrentError(error);
      expect(result.type).toBe("Zod");
      expect(result).toHaveProperty("errors");
    }
  });

  it("should return correct error object for generic Error", () => {
    const genericError = new Error("Something went wrong");
    const result = getCurrentError(genericError);
    expect(result).toEqual({
      type: "Server",
      name: "Error",
      message: "Something went wrong",
    });
  });

  it("should return correct error object for unknown error type", () => {
    const unknownError: unknown = { some: "error" };
    const result = getCurrentError(unknownError);
    expect(result).toEqual({
      type: "Unknown",
      error: unknownError,
    });
  });
});
