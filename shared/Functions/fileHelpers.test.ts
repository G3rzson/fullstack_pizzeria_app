import { describe, it, expect } from "vitest";
import { isFileListLike, toExistingImage, toSingleFile } from "./fileHelpers";

describe("isFileListLike", () => {
  it("should return false for primitive values", () => {
    expect(isFileListLike(null)).toBe(false);
    expect(isFileListLike(undefined)).toBe(false);
    expect(isFileListLike(123)).toBe(false);
    expect(isFileListLike("abc")).toBe(false);
  });

  it("should return false if length or item is missing", () => {
    expect(isFileListLike({})).toBe(false);
    expect(isFileListLike({ length: 0 })).toBe(false);
    expect(isFileListLike({ item: () => null })).toBe(false);
  });

  it("should return true if length and item are present", () => {
    const fakeFileList = { length: 1, item: (i: number) => null };
    expect(isFileListLike(fakeFileList)).toBe(true);
  });
});

describe("toSingleFile", () => {
  it("should return the File if valid", () => {
    const file = new File([""], "test.png");
    expect(toSingleFile(file)).toBe(file);
  });

  it("should return null for an empty File", () => {
    const file = new File([""], "");
    expect(toSingleFile(file)).toBeNull();
  });

  it("should return the first element from a FileListLike", () => {
    const file = new File([""], "file.png");
    const list = { length: 1, item: (i: number) => file };
    expect(toSingleFile(list)).toBe(file);
  });

  it("should return null for an empty FileListLike", () => {
    const list = { length: 0, item: () => null };
    expect(toSingleFile(list)).toBeNull();
  });

  it("should return null if not a File and not a FileListLike", () => {
    expect(toSingleFile({})).toBeNull();
  });
});

describe("toExistingImage", () => {
  it("should return null if value is not an object", () => {
    expect(toExistingImage(null)).toBeNull();
    expect(toExistingImage(undefined)).toBeNull();
  });

  it("should return null if name or url is not a string", () => {
    expect(toExistingImage({ name: 123, url: "url" })).toBeNull();
    expect(toExistingImage({ name: "name", url: 123 })).toBeNull();
  });

  it("should return null if url is empty", () => {
    expect(toExistingImage({ name: "x", url: " " })).toBeNull();
  });

  it("should return the object if valid", () => {
    const val = { name: "pizza", url: "http://img.png" };
    expect(toExistingImage(val)).toEqual(val);
  });

  it("should return a default name if name is empty", () => {
    const val = { name: "  ", url: "http://img.png" };
    expect(toExistingImage(val)).toEqual({
      name: "pizza-image",
      url: "http://img.png",
    });
  });
});
