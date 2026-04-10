import { describe, it, expect } from "vitest";
import { registerSchema, type RegisterSchemaType } from "./registerSchema";

describe("registerSchema schema", () => {
  it("accepts valid data", () => {
    const data: RegisterSchemaType = {
      username: "validusername",
      email: "validemail@example.com",
      password: "Valid123",
    };
    const result = registerSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("trims and normalizes username", () => {
    const data: RegisterSchemaType = {
      username: "   Valid    Username    ",
      email: "validemail@example.com",
      password: "Valid123",
    };
    const result = registerSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.username).toBe("Valid Username");
    }
  });

  it("converts email to lowercase", () => {
    const data: RegisterSchemaType = {
      username: "Teszt",
      email: "TEST@EMAIL.COM",
      password: "Password1",
    };

    const result = registerSchema.safeParse(data);
    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.email).toBe("test@email.com");
    }
  });

  it("rejects invalid data", () => {
    const data: RegisterSchemaType = {
      username: "",
      email: "invalidemail",
      password: "short",
    };
    const result = registerSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("rejects short password", () => {
    const data: RegisterSchemaType = {
      username: "Teszt",
      email: "test@email.com",
      password: "Ab1",
    };
    const result = registerSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("rejects password without lowercase", () => {
    const data: RegisterSchemaType = {
      username: "Teszt",
      email: "test@email.com",
      password: "PASSWORD1",
    };
    const result = registerSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("rejects password without uppercase", () => {
    const data: RegisterSchemaType = {
      username: "Teszt",
      email: "test@email.com",
      password: "password1",
    };

    const result = registerSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("rejects password without number", () => {
    const data: RegisterSchemaType = {
      username: "Teszt",
      email: "test@email.com",
      password: "Password",
    };
    const result = registerSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("rejects password with special characters", () => {
    const data: RegisterSchemaType = {
      username: "Teszt",
      email: "test@email.com",
      password: "Password1!",
    };
    const result = registerSchema.safeParse(data);
    expect(result.success).toBe(false);
  });
});
