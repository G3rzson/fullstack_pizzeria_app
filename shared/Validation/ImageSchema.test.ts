import { describe, it, expect } from "vitest";
import { imageSchema } from "./ImageSchema";
import { MAX_FILE_SIZE } from "../Constants/constants";

describe("imageSchema", () => {
  describe("valid cases", () => {
    it("should accept null value", () => {
      const result = imageSchema.safeParse({ image: null });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.image).toBeNull();
      }
    });

    it("should accept valid jpeg file", () => {
      const file = new File(["content"], "test.jpg", { type: "image/jpeg" });
      const result = imageSchema.safeParse({ image: file });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.image).toBe(file);
      }
    });

    it("should accept valid png file", () => {
      const file = new File(["content"], "test.png", { type: "image/png" });
      const result = imageSchema.safeParse({ image: file });
      expect(result.success).toBe(true);
    });

    it("should accept valid webp file", () => {
      const file = new File(["content"], "test.webp", { type: "image/webp" });
      const result = imageSchema.safeParse({ image: file });
      expect(result.success).toBe(true);
    });

    it("should accept valid gif file", () => {
      const file = new File(["content"], "test.gif", { type: "image/gif" });
      const result = imageSchema.safeParse({ image: file });
      expect(result.success).toBe(true);
    });

    it("should accept file at maximum size limit", () => {
      const content = new Array(MAX_FILE_SIZE).fill("a").join("");
      const file = new File([content], "large.jpg", { type: "image/jpeg" });
      const result = imageSchema.safeParse({ image: file });
      expect(result.success).toBe(true);
    });

    it("should accept empty file (transforms to null)", () => {
      const emptyFile = new File([""], "", { type: "image/jpeg" });
      const result = imageSchema.safeParse({ image: emptyFile });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.image).toBeNull();
      }
    });

    it("should accept FileList-like object with valid file", () => {
      const file = new File(["content"], "test.jpg", { type: "image/jpeg" });
      const fileList = {
        length: 1,
        item: (index: number) => (index === 0 ? file : null),
      };
      const result = imageSchema.safeParse({ image: fileList });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.image).toBe(file);
      }
    });

    it("should accept empty FileList-like object (transforms to null)", () => {
      const fileList = {
        length: 0,
        item: () => null,
      };
      const result = imageSchema.safeParse({ image: fileList });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.image).toBeNull();
      }
    });
  });

  describe("invalid file type", () => {
    it("should reject pdf file", () => {
      const file = new File(["content"], "doc.pdf", {
        type: "application/pdf",
      });
      const result = imageSchema.safeParse({ image: file });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Csak kép formátum engedélyezett!",
        );
      }
    });

    it("should reject svg file", () => {
      const file = new File(["<svg></svg>"], "icon.svg", {
        type: "image/svg+xml",
      });
      const result = imageSchema.safeParse({ image: file });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Csak kép formátum engedélyezett!",
        );
      }
    });

    it("should reject text file", () => {
      const file = new File(["text"], "file.txt", { type: "text/plain" });
      const result = imageSchema.safeParse({ image: file });
      expect(result.success).toBe(false);
    });

    it("should reject video file", () => {
      const file = new File(["video"], "video.mp4", { type: "video/mp4" });
      const result = imageSchema.safeParse({ image: file });
      expect(result.success).toBe(false);
    });
  });

  describe("invalid file size", () => {
    it("should reject file larger than MAX_FILE_SIZE", () => {
      const largeContent = new Array(MAX_FILE_SIZE + 1000).fill("a").join("");
      const file = new File([largeContent], "large.jpg", {
        type: "image/jpeg",
      });
      const result = imageSchema.safeParse({ image: file });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(`Max 5 MB`);
      }
    });

    it("should reject 10MB file", () => {
      const largeContent = new Array(10 * 1024 * 1024).fill("a").join("");
      const file = new File([largeContent], "huge.jpg", {
        type: "image/jpeg",
      });
      const result = imageSchema.safeParse({ image: file });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("Max");
        expect(result.error.issues[0].message).toContain("MB");
      }
    });
  });

  describe("edge cases", () => {
    it("should transform non-File values to null", () => {
      const result = imageSchema.safeParse({ image: "not a file" });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.image).toBeNull();
      }
    });

    it("should transform object to null", () => {
      const result = imageSchema.safeParse({ image: { name: "fake" } });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.image).toBeNull();
      }
    });

    it("should transform undefined to null", () => {
      const result = imageSchema.safeParse({ image: undefined });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.image).toBeNull();
      }
    });

    it("should transform number to null", () => {
      const result = imageSchema.safeParse({ image: 123 });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.image).toBeNull();
      }
    });
  });

  describe("type exports", () => {
    it("should have correct input and output types", () => {
      // Type-only test - just to ensure the types are exported
      type InputType = { image: unknown };
      type OutputType = { image: File | null };

      const input: InputType = { image: null };
      const parsed = imageSchema.parse(input);
      const output: OutputType = parsed;

      expect(output.image).toBeNull();
    });
  });
});
