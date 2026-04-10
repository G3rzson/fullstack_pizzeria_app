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
vi.mock("../_dal/drinkDal", () => ({ updateDrinkImageDal: vi.fn() }));
vi.mock("@/shared/Functions/isDev", () => ({ default: mockIsDev }));
vi.mock("@/shared/Functions/errorLogger", () => ({ errorLogger: vi.fn() }));

import { updateDrinkImageAction } from "./updateDrinkImageAction";
import { revalidatePath } from "next/cache";
import { hasPermission } from "@/shared/Functions/hasPermission";
import { idValidator } from "@/shared/Functions/idValidator";
import { imageSchema } from "@/shared/Validation/ImageSchema";
import { uploadImageToCloudinary } from "@/lib/claudinary/uploadImageToCloudinary";
import { deleteCloudinaryImage } from "@/lib/claudinary/deleteCloudinaryImage";
import { updateDrinkImageDal } from "../_dal/drinkDal";
import { errorLogger } from "@/shared/Functions/errorLogger";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";

describe("updateDrinkImageAction action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsDev.mockReturnValue(true);
  });

  it("returns unauthorized when permission check fails", async () => {
    (hasPermission as Mock).mockResolvedValue(false);

    const result = await updateDrinkImageAction("d1", {}, "old-id");

    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.UNAUTHORIZED);
  });

  it("returns invalid id when id validation fails", async () => {
    (hasPermission as Mock).mockResolvedValue({ username: "admin" });
    (idValidator.safeParse as Mock).mockReturnValue({ success: false });

    const result = await updateDrinkImageAction("bad", {}, "old-id");

    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.INVALID_ID);
  });

  it("returns invalid data when image schema fails", async () => {
    (hasPermission as Mock).mockResolvedValue({ username: "admin" });
    (idValidator.safeParse as Mock).mockReturnValue({
      success: true,
      data: { id: "d1" },
    });
    (imageSchema.safeParseAsync as Mock).mockResolvedValue({ success: false });

    const result = await updateDrinkImageAction("d1", {}, "old-id");

    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.INVALID_DATA);
  });

  it("updates drink image, deletes old image, and revalidates", async () => {
    const file = { name: "new-drink.png" } as File;
    (hasPermission as Mock).mockResolvedValue({ username: "admin" });
    (idValidator.safeParse as Mock).mockReturnValue({
      success: true,
      data: { id: "d1" },
    });
    (imageSchema.safeParseAsync as Mock).mockResolvedValue({
      success: true,
      data: { image: file },
    });
    (uploadImageToCloudinary as Mock).mockResolvedValue({
      public_id: "new-cloud-id",
      secure_url: "https://img.url/new-drink.png",
    });

    const result = await updateDrinkImageAction("d1", file, "old-cloud-id");

    expect(result.success).toBe(true);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.SUCCESS);
    expect(updateDrinkImageDal).toHaveBeenCalledWith("d1", {
      publicId: "new-cloud-id",
      publicUrl: "https://img.url/new-drink.png",
      originalName: "new-drink.png",
    });
    expect(deleteCloudinaryImage).toHaveBeenCalledWith("old-cloud-id");
    expect(revalidatePath).toHaveBeenCalledWith("/drinks");
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard/drinks");
  });

  it("cleans up new cloudinary image when dal throws after upload", async () => {
    const file = { name: "new-drink.png" } as File;
    (hasPermission as Mock).mockResolvedValue({ username: "admin" });
    (idValidator.safeParse as Mock).mockReturnValue({
      success: true,
      data: { id: "d1" },
    });
    (imageSchema.safeParseAsync as Mock).mockResolvedValue({
      success: true,
      data: { image: file },
    });
    (uploadImageToCloudinary as Mock).mockResolvedValue({
      public_id: "new-cloud-id",
      secure_url: "https://img.url/new-drink.png",
    });
    (updateDrinkImageDal as Mock).mockRejectedValue(new Error("db error"));

    const result = await updateDrinkImageAction("d1", file, "old-cloud-id");

    expect(result.success).toBe(false);
    expect(deleteCloudinaryImage).toHaveBeenCalledWith("new-cloud-id");
  });

  it("logs with errorLogger in dev mode on error", async () => {
    (hasPermission as Mock).mockRejectedValue(new Error("db error"));

    await updateDrinkImageAction("d1", {}, "old-id");

    expect(errorLogger).toHaveBeenCalled();
  });

  it("logs with console.error in non-dev mode on error", async () => {
    mockIsDev.mockReturnValue(false);
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    (hasPermission as Mock).mockRejectedValue(new Error("db error"));

    const result = await updateDrinkImageAction("d1", {}, "old-id");

    expect(consoleSpy).toHaveBeenCalled();
    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.SERVER_ERROR);
    consoleSpy.mockRestore();
  });
});
