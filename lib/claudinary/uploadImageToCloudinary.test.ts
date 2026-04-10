import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";

const { mockUploadStream, mockEnd } = vi.hoisted(() => ({
  mockUploadStream: vi.fn(),
  mockEnd: vi.fn(),
}));

vi.mock("@/lib/claudinary/claudinary", () => ({
  default: {
    uploader: {
      upload_stream: mockUploadStream,
    },
  },
}));

import { uploadImageToCloudinary } from "./uploadImageToCloudinary";

describe("uploadImageToCloudinary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("uploads file buffer with the given folder", async () => {
    const fakeUploadResult = {
      public_id: "cloud-id",
      secure_url: "https://res.cloudinary.com/demo/image/upload/v1/sample.jpg",
    };

    (mockUploadStream as Mock).mockImplementation(
      (
        options: { folder: string },
        callback: (error: unknown, result: unknown) => void,
      ) => {
        callback(null, fakeUploadResult);
        return { end: mockEnd };
      },
    );

    const arrayBuffer = new TextEncoder().encode("hello").buffer;
    const fileLike = {
      arrayBuffer: vi.fn().mockResolvedValue(arrayBuffer),
    } as unknown as File;

    const result = await uploadImageToCloudinary(fileLike, "pizzas");

    expect(mockUploadStream).toHaveBeenCalledWith(
      { folder: "pizzas" },
      expect.any(Function),
    );
    expect(mockEnd).toHaveBeenCalledWith(Buffer.from(arrayBuffer));
    expect(result).toEqual(fakeUploadResult);
  });

  it("rejects when cloudinary upload_stream callback receives error", async () => {
    (mockUploadStream as Mock).mockImplementation(
      (
        _options: { folder: string },
        callback: (error: unknown, result: unknown) => void,
      ) => {
        callback(new Error("upload failed"), null);
        return { end: mockEnd };
      },
    );

    const arrayBuffer = new TextEncoder().encode("hello").buffer;
    const fileLike = {
      arrayBuffer: vi.fn().mockResolvedValue(arrayBuffer),
    } as unknown as File;

    await expect(uploadImageToCloudinary(fileLike, "drinks")).rejects.toThrow(
      "upload failed",
    );
    expect(mockUploadStream).toHaveBeenCalledWith(
      { folder: "drinks" },
      expect.any(Function),
    );
  });
});
