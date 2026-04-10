import { describe, it, expect } from "vitest";
import { textFormatter } from "./textFormatter";

describe("Text Formatter", () => {
  it("should format text to title case", () => {
    const input = "hello world";
    const expectedOutput = "Hello world";
    expect(textFormatter(input)).toBe(expectedOutput);
  });

  it("should handle uppercase text", () => {
    const input = "HELLO WORLD";
    const expectedOutput = "Hello world";
    expect(textFormatter(input)).toBe(expectedOutput);
  });

  it("should handle single word", () => {
    const input = "pizzazz";
    const expectedOutput = "Pizzazz";
    expect(textFormatter(input)).toBe(expectedOutput);
  });

  it("should handle single character", () => {
    const input = "a";
    const expectedOutput = "A";
    expect(textFormatter(input)).toBe(expectedOutput);
  });

  it("should handle empty string", () => {
    const input = "";
    const expectedOutput = "";
    expect(textFormatter(input)).toBe(expectedOutput);
  });
});
