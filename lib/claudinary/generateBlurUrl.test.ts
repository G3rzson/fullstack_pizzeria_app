import { describe, it, expect } from "vitest";
import { generateBlurUrl } from "./generateBlurUrl";

describe("generateBlurUrl", () => {
  it("returns original value when url is empty", () => {
    expect(generateBlurUrl("")).toBe("");
  });

  it("returns original value when url is not a cloudinary url", () => {
    const url = "https://example.com/image.jpg";
    expect(generateBlurUrl(url)).toBe(url);
  });

  it("returns original value when url does not contain /upload/ segment", () => {
    const url = "https://res.cloudinary.com/demo/image/v12345/sample.jpg";
    expect(generateBlurUrl(url)).toBe(url);
  });

  it("inserts blur transformations after /upload/", () => {
    const url =
      "https://res.cloudinary.com/demo/image/upload/v12345/folder/sample.jpg";

    expect(generateBlurUrl(url)).toBe(
      "https://res.cloudinary.com/demo/image/upload/w_10,q_10,e_blur:1000,f_auto/v12345/folder/sample.jpg",
    );
  });
});
