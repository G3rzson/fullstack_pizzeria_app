import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { uploadDrinkImageAction } from "./uploadDrinkImageAction";

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
vi.mock("../_dal/drinkDal", () => ({ uploadDrinkImageDal: vi.fn() }));

import { revalidatePath } from "next/cache";
import { hasPermission } from "@/shared/Functions/hasPermission";
import { idValidator } from "@/shared/Functions/idValidator";
import { imageSchema } from "@/shared/Validation/ImageSchema";
import { uploadImageToCloudinary } from "@/lib/claudinary/uploadImageToCloudinary";
import { uploadDrinkImageDal } from "../_dal/drinkDal";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";

describe("uploadDrinkImageAction", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns invalid data when schema fails", async () => {
    (hasPermission as Mock).mockResolvedValue({ username: "admin" });
    (idValidator.safeParse as Mock).mockReturnValue({
      success: true,
      data: { id: "d1" },
    });
    (imageSchema.safeParseAsync as Mock).mockResolvedValue({ success: false });

    const result = await uploadDrinkImageAction("d1", {});

    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.INVALID_DATA);
  });

  it("uploads drink image and revalidates", async () => {
    const file = { name: "drink.png" } as File;
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
      public_id: "cloud-id",
      secure_url: "https://img.url/drink.png",
    });

    const result = await uploadDrinkImageAction("d1", file);

    expect(result.success).toBe(true);
    expect(uploadDrinkImageDal).toHaveBeenCalledWith("d1", {
      publicId: "cloud-id",
      publicUrl: "https://img.url/drink.png",
      originalName: "drink.png",
    });
    expect(revalidatePath).toHaveBeenCalledWith("/drinks");
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard/drinks");
  });
});
