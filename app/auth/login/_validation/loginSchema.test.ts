import { describe, it, expect } from "vitest";
import { loginSchema, LoginSchemaType } from "./loginSchema";

describe("loginSchema", () => {
  it("accepts valid data", () => {
    const data: LoginSchemaType = {
      username: "validusername",
      password: "Valid123",
    };
    const result = loginSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("trims and normalizes username", () => {
    const data: LoginSchemaType = {
      username: "   Valid    Username    ",
      password: "Valid123",
    };
    const result = loginSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.username).toBe("Valid Username");
    }
  });

  it("rejects invalid data", () => {
    const data: LoginSchemaType = {
      username: "",

      password: "short",
    };
    const result = loginSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("rejects short password", () => {
    const data: LoginSchemaType = {
      username: "Teszt",
      password: "Ab1",
    };
    const result = loginSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("rejects password without lowercase", () => {
    const data: LoginSchemaType = {
      username: "Teszt",
      password: "PASSWORD1",
    };
    const result = loginSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("rejects password without uppercase", () => {
    const data: LoginSchemaType = {
      username: "Teszt",
      password: "password1",
    };

    const result = loginSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("rejects password without number", () => {
    const data: LoginSchemaType = {
      username: "Teszt",
      password: "Password",
    };
    const result = loginSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("rejects password with special characters", () => {
    const data: LoginSchemaType = {
      username: "Teszt",
      password: "Password1!",
    };
    const result = loginSchema.safeParse(data);
    expect(result.success).toBe(false);
  });
});
