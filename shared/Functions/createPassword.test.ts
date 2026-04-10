import { describe, it, expect } from "vitest";
import { createPassword } from "./createPassword";

describe("createPassword", () => {
  it("should generate a password with correct length", () => {
    const password = createPassword();
    expect(password.length).toBe(12);
  });

  it("should contain lowercase letter", () => {
    const password = createPassword();
    expect(/[a-z]/.test(password)).toBe(true);
  });

  it("should contain uppercase letter", () => {
    const password = createPassword();
    expect(/[A-Z]/.test(password)).toBe(true);
  });

  it("should contain number", () => {
    const password = createPassword();
    expect(/\d/.test(password)).toBe(true);
  });
});
