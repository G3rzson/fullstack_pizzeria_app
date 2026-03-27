import { handleResponse } from "./handleResponse";
import { describe, it, expect } from "vitest";

describe("handleResponse", () => {
  it("should return an object with success and message", () => {
    const result = handleResponse(true, "ok");
    expect(result).toEqual({ success: true, message: "ok" });
  });

  it("should handle false success", () => {
    const result = handleResponse(false, "error");
    expect(result).toEqual({ success: false, message: "error" });
  });
});
