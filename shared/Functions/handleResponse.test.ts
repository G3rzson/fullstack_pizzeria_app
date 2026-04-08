import { handleResponse } from "./handleResponse";
import { describe, it, expect } from "vitest";

describe("handleResponse", () => {
  it("should return error response without data", () => {
    const result = handleResponse(false, "Error occurred");
    expect(result).toEqual({
      success: false,
      message: "Error occurred",
    });
  });

  it("should return success response without data", () => {
    const result = handleResponse(true, "Operation successful");
    expect(result).toEqual({
      success: true,
      message: "Operation successful",
    });
  });

  it("should return success response with data", () => {
    const data = { id: 1, name: "Test Item" };
    const result = handleResponse(true, "Operation successful", data);
    expect(result).toEqual({
      success: true,
      message: "Operation successful",
      data,
    });
  });
});
