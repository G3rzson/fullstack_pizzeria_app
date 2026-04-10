import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";

const { mockIsDev } = vi.hoisted(() => {
  const mockIsDev = vi.fn();
  return { mockIsDev };
});

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/shared/Functions/hasPermission", () => ({ hasPermission: vi.fn() }));
vi.mock("@/shared/Functions/idValidator", () => ({
  idValidator: { safeParse: vi.fn() },
}));
vi.mock("@/shared/Validation/ImageSchema", () => ({
  imageSchema: { safeParseAsync: vi.fn() },
}));
vi.mock("@/lib/claudinary/uploadImageToCloudinary", () => ({
  uploadImageToCloudinary: vi.fn(),
}));
vi.mock("@/lib/claudinary/deleteCloudinaryImage", () => ({
  deleteCloudinaryImage: vi.fn(),
}));
vi.mock("../_dal/pastaDal", () => ({ uploadPastaImageDal: vi.fn() }));
vi.mock("@/shared/Functions/isDev", () => ({ default: mockIsDev }));
vi.mock("@/shared/Functions/errorLogger", () => ({ errorLogger: vi.fn() }));

import { uploadPastaImageAction } from "./uploadPastaImageAction";
import { revalidatePath } from "next/cache";
import { hasPermission } from "@/shared/Functions/hasPermission";
import { idValidator } from "@/shared/Functions/idValidator";
import { imageSchema } from "@/shared/Validation/ImageSchema";
import { uploadImageToCloudinary } from "@/lib/claudinary/uploadImageToCloudinary";
import { deleteCloudinaryImage } from "@/lib/claudinary/deleteCloudinaryImage";
import { uploadPastaImageDal } from "../_dal/pastaDal";
import { errorLogger } from "@/shared/Functions/errorLogger";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";

describe("uploadPastaImageAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsDev.mockReturnValue(true);
  });

  it("returns unauthorized when permission check fails", async () => {
    (hasPermission as Mock).mockResolvedValue(false);

    const result = await uploadPastaImageAction("t1", {});

    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.UNAUTHORIZED);
  });

  it("returns invalid id when id validation fails", async () => {
    (hasPermission as Mock).mockResolvedValue({ username: "admin" });
    (idValidator.safeParse as Mock).mockReturnValue({ success: false });

    const result = await uploadPastaImageAction("bad", {});

    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.INVALID_ID);
  });

  it("returns invalid data when schema fails", async () => {
    (hasPermission as Mock).mockResolvedValue({ username: "admin" });
    (idValidator.safeParse as Mock).mockReturnValue({
      success: true,
      data: { id: "t1" },
    });
    (imageSchema.safeParseAsync as Mock).mockResolvedValue({ success: false });

    const result = await uploadPastaImageAction("t1", {});

    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.INVALID_DATA);
  });

  it("uploads pasta image and revalidates", async () => {
    const file = { name: "pasta.png" } as File;
    (hasPermission as Mock).mockResolvedValue({ username: "admin" });
    (idValidator.safeParse as Mock).mockReturnValue({
      success: true,
      data: { id: "t1" },
    });
    (imageSchema.safeParseAsync as Mock).mockResolvedValue({
      success: true,
      data: { image: file },
    });
    (uploadImageToCloudinary as Mock).mockResolvedValue({
      public_id: "cloud-id",
      secure_url: "https://img.url/pasta.png",
    });

    const result = await uploadPastaImageAction("t1", file);

    expect(result.success).toBe(true);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.SUCCESS);
    expect(uploadPastaImageDal).toHaveBeenCalledWith("t1", {
      publicId: "cloud-id",
      publicUrl: "https://img.url/pasta.png",
      originalName: "pasta.png",
    });
    expect(revalidatePath).toHaveBeenCalledWith("/pastas");
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard/pastas");
  });

  it("cleans up cloudinary image when dal throws after upload", async () => {
    const file = { name: "pasta.png" } as File;
    (hasPermission as Mock).mockResolvedValue({ username: "admin" });
    (idValidator.safeParse as Mock).mockReturnValue({
      success: true,
      data: { id: "t1" },
    });
    (imageSchema.safeParseAsync as Mock).mockResolvedValue({
      success: true,
      data: { image: file },
    });
    (uploadImageToCloudinary as Mock).mockResolvedValue({
      public_id: "cloud-id",
      secure_url: "https://img.url/pasta.png",
    });
    (uploadPastaImageDal as Mock).mockRejectedValue(new Error("db error"));

    const result = await uploadPastaImageAction("t1", file);

    expect(result.success).toBe(false);
    expect(deleteCloudinaryImage).toHaveBeenCalledWith("cloud-id");
  });

  it("logs with errorLogger in dev mode on error", async () => {
    (hasPermission as Mock).mockRejectedValue(new Error("db error"));

    await uploadPastaImageAction("t1", {});

    expect(errorLogger).toHaveBeenCalled();
  });

  it("logs with console.error in non-dev mode on error", async () => {
    mockIsDev.mockReturnValue(false);
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    (hasPermission as Mock).mockRejectedValue(new Error("db error"));

    const result = await uploadPastaImageAction("t1", {});

    expect(consoleSpy).toHaveBeenCalled();
    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.SERVER_ERROR);
    consoleSpy.mockRestore();
  });
});
