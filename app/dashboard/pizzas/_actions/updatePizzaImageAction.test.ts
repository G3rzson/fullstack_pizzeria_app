import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { updatePizzaImageAction } from "./updatePizzaImageAction";

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
  updatePizzaImageDal: vi.fn(),
}));

import { revalidatePath } from "next/cache";
import { hasPermission } from "@/shared/Functions/hasPermission";
import { idValidator } from "@/shared/Functions/idValidator";
import { imageSchema } from "@/shared/Validation/ImageSchema";
import { uploadImageToCloudinary } from "@/lib/claudinary/uploadImageToCloudinary";
import { deleteCloudinaryImage } from "@/lib/claudinary/deleteCloudinaryImage";
import { updatePizzaImageDal } from "@/app/dashboard/pizzas/_dal/pizzaDal";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";

describe("updatePizzaImageAction", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns invalid id when id validation fails", async () => {
    (hasPermission as Mock).mockResolvedValue({ username: "admin" });
    (idValidator.safeParse as Mock).mockReturnValue({ success: false });

    const result = await updatePizzaImageAction("bad", {}, "old-id");

    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.INVALID_ID);
  });

  it("updates image, deletes old image, and revalidates", async () => {
    const file = { name: "new-pizza.png" } as File;
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
      public_id: "new-cloud-id",
      secure_url: "https://img.url/new-pizza.png",
    });

    const result = await updatePizzaImageAction("p1", file, "old-cloud-id");

    expect(result.success).toBe(true);
    expect(updatePizzaImageDal).toHaveBeenCalledWith("p1", {
      publicId: "new-cloud-id",
      publicUrl: "https://img.url/new-pizza.png",
      originalName: "new-pizza.png",
    });
    expect(deleteCloudinaryImage).toHaveBeenCalledWith("old-cloud-id");
    expect(revalidatePath).toHaveBeenCalledWith("/pizzas");
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard/pizzas");
  });
});
