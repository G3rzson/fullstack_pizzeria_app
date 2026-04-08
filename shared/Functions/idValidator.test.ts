import { describe, it, expect } from "vitest";
import { idValidator } from "./idValidator";

describe("idValidator", () => {
  it("should accept valid UUID", async () => {
    const result = await idValidator.safeParseAsync({
      id: "550e8400-e29b-41d4-a716-446655440000",
    });

    expect(result.success).toBe(true);
  });

  it("should reject non-UUID string", async () => {
    const result = await idValidator.safeParseAsync({
      id: "123",
    });

    expect(result.success).toBe(false);
  });

  it("should reject if id is missing", async () => {
    const result = await idValidator.safeParseAsync({});

    expect(result.success).toBe(false);
  });
});
