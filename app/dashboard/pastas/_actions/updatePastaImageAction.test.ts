import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { updatePastaImageAction } from "./updatePastaImageAction";

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
vi.mock("../_dal/pastaDal", () => ({ updatePastaImageDal: vi.fn() }));

import { revalidatePath } from "next/cache";
import { hasPermission } from "@/shared/Functions/hasPermission";
import { idValidator } from "@/shared/Functions/idValidator";
import { imageSchema } from "@/shared/Validation/ImageSchema";
import { uploadImageToCloudinary } from "@/lib/claudinary/uploadImageToCloudinary";
import { deleteCloudinaryImage } from "@/lib/claudinary/deleteCloudinaryImage";
import { updatePastaImageDal } from "../_dal/pastaDal";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";

describe("updatePastaImageAction", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns unauthorized when permission is missing", async () => {
    (hasPermission as Mock).mockResolvedValue(false);

    const result = await updatePastaImageAction("t1", {}, "old-id");

    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.UNAUTHORIZED);
  });

  it("updates pasta image, deletes old image, and revalidates", async () => {
    const file = { name: "new-pasta.png" } as File;
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
      public_id: "new-cloud-id",
      secure_url: "https://img.url/new-pasta.png",
    });

    const result = await updatePastaImageAction("t1", file, "old-cloud-id");

    expect(result.success).toBe(true);
    expect(updatePastaImageDal).toHaveBeenCalledWith("t1", {
      publicId: "new-cloud-id",
      publicUrl: "https://img.url/new-pasta.png",
      originalName: "new-pasta.png",
    });
    expect(deleteCloudinaryImage).toHaveBeenCalledWith("old-cloud-id");
    expect(revalidatePath).toHaveBeenCalledWith("/pastas");
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard/pastas");
  });
});
