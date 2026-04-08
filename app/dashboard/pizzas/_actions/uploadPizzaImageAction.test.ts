import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { uploadPizzaImageAction } from "./uploadPizzaImageAction";

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
vi.mock("@/app/dashboard/pizzas/_dal/pizzaDal", () => ({
  uploadPizzaImageDal: vi.fn(),
}));

import { revalidatePath } from "next/cache";
import { hasPermission } from "@/shared/Functions/hasPermission";
import { idValidator } from "@/shared/Functions/idValidator";
import { imageSchema } from "@/shared/Validation/ImageSchema";
import { uploadImageToCloudinary } from "@/lib/claudinary/uploadImageToCloudinary";
import { uploadPizzaImageDal } from "@/app/dashboard/pizzas/_dal/pizzaDal";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";

describe("uploadPizzaImageAction", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns unauthorized when permission is missing", async () => {
    (hasPermission as Mock).mockResolvedValue(false);

    const result = await uploadPizzaImageAction("p1", {});

    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.UNAUTHORIZED);
  });

  it("uploads image, saves it, and revalidates", async () => {
    const file = { name: "pizza.png" } as File;
    (hasPermission as Mock).mockResolvedValue({ username: "admin" });
    (idValidator.safeParse as Mock).mockReturnValue({
      success: true,
      data: { id: "p1" },
    });
    (imageSchema.safeParseAsync as Mock).mockResolvedValue({
      success: true,
      data: { image: file },
    });
    (uploadImageToCloudinary as Mock).mockResolvedValue({
      public_id: "cloud-id",
      secure_url: "https://img.url/pizza.png",
    });

    const result = await uploadPizzaImageAction("p1", file);

    expect(result.success).toBe(true);
    expect(uploadPizzaImageDal).toHaveBeenCalledWith("p1", {
      publicId: "cloud-id",
      publicUrl: "https://img.url/pizza.png",
      originalName: "pizza.png",
    });
    expect(revalidatePath).toHaveBeenCalledWith("/pizzas");
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard/pizzas");
  });
});
