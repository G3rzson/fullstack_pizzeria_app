import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { errorLogger } from "./errorLogger";
import fs from "fs/promises";

// Mock fs/promises
vi.mock("fs/promises", () => ({
  default: {
    mkdir: vi.fn().mockResolvedValue(undefined),
    appendFile: vi.fn().mockResolvedValue(undefined),
  },
}));

// Tipushelyes mock
const mockMkdir = fs.mkdir as unknown as Mock;
const mockAppendFile = fs.appendFile as unknown as Mock;

describe("errorLogger with fs mock", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call fs methods with correct arguments", async () => {
    const testError = new Error("Teszt hiba");
    await errorLogger(testError, "Test context");

    expect(mockMkdir).toHaveBeenCalled();
    expect(mockAppendFile).toHaveBeenCalled();

    const logArg = mockAppendFile.mock.calls[0][1]; // string típus
    const logObject = JSON.parse(logArg);

    expect(logObject.context).toBe("Test context");
    expect(logObject.error.type).toBe("Server");
    expect(logObject.error.message).toBe("Teszt hiba");
  });

  it("should handle fs errors gracefully", async () => {
    mockAppendFile.mockRejectedValue(new Error("FS write error"));

    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const testError = new Error("Teszt hiba");
    await errorLogger(testError, "Test context");

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Failed to write to log file:",
      expect.any(Error),
    );

    consoleErrorSpy.mockRestore();
  });
});
