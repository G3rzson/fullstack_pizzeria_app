import { describe, it, expect } from "vitest";
import { createPassword } from "./createPassword";

describe("createPassword", () => {
  it("generates a password with correct length", () => {
    const password = createPassword();
    expect(password.length).toBe(12);
  });

  it("contains lowercase letter", () => {
    const password = createPassword();
    expect(/[a-z]/.test(password)).toBe(true);
  });

  it("contains uppercase letter", () => {
    const password = createPassword();
    expect(/[A-Z]/.test(password)).toBe(true);
  });

  it("contains number", () => {
    const password = createPassword();
    expect(/\d/.test(password)).toBe(true);
  });
});
