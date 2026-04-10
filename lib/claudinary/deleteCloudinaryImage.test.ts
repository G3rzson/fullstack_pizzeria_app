import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";

const { mockDestroy } = vi.hoisted(() => ({
  mockDestroy: vi.fn(),
}));

vi.mock("@/lib/claudinary/claudinary", () => ({
  default: {
    uploader: {
      destroy: mockDestroy,
    },
  },
}));

import { deleteCloudinaryImage } from "./deleteCloudinaryImage";

describe("deleteCloudinaryImage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not call cloudinary when publicId is null", async () => {
    await deleteCloudinaryImage(null);

    expect(mockDestroy).not.toHaveBeenCalled();
  });

  it("calls cloudinary destroy when publicId exists", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    (mockDestroy as Mock).mockResolvedValue({ result: "ok" });

    await deleteCloudinaryImage("cloud-id");

    expect(mockDestroy).toHaveBeenCalledWith("cloud-id");
    expect(consoleSpy).toHaveBeenCalledWith("Cloudinary image deleted:", {
      result: "ok",
    });
    consoleSpy.mockRestore();
  });

  it("logs error when cloudinary destroy throws", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    (mockDestroy as Mock).mockRejectedValue(new Error("cloud error"));

    await deleteCloudinaryImage("cloud-id");

    expect(mockDestroy).toHaveBeenCalledWith("cloud-id");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error deleting Cloudinary image:",
      expect.any(Error),
    );
    consoleSpy.mockRestore();
  });
});
