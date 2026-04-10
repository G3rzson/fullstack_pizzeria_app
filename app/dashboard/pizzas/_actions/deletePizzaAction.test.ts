import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";

const { mockIsDev } = vi.hoisted(() => {
  const mockIsDev = vi.fn();
  return { mockIsDev };
});

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("../_dal/pizzaDal", () => ({ deletePizzaDal: vi.fn() }));
vi.mock("@/shared/Functions/idValidator", () => ({
  idValidator: { safeParse: vi.fn() },
}));
vi.mock("@/shared/Functions/hasPermission", () => ({ hasPermission: vi.fn() }));
vi.mock("@/shared/Functions/isDev", () => ({ default: mockIsDev }));
vi.mock("@/shared/Functions/errorLogger", () => ({ errorLogger: vi.fn() }));
vi.mock("@/lib/claudinary/deleteCloudinaryImage", () => ({
  deleteCloudinaryImage: vi.fn(),
}));

import { deletePizzaAction } from "./deletePizzaAction";
import { revalidatePath } from "next/cache";
import { deletePizzaDal } from "../_dal/pizzaDal";
import { idValidator } from "@/shared/Functions/idValidator";
import { hasPermission } from "@/shared/Functions/hasPermission";
import { errorLogger } from "@/shared/Functions/errorLogger";
import { deleteCloudinaryImage } from "@/lib/claudinary/deleteCloudinaryImage";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";

describe("deletePizzaAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsDev.mockReturnValue(true);
  });

  it("returns unauthorized when permission check fails", async () => {
    (hasPermission as Mock).mockResolvedValue(false);

    const result = await deletePizzaAction("p1", null);

    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.UNAUTHORIZED);
  });

  it("returns invalid id when id is invalid", async () => {
    (hasPermission as Mock).mockResolvedValue({ username: "admin" });
    (idValidator.safeParse as Mock).mockReturnValue({ success: false });

    const result = await deletePizzaAction("bad-id", null);

    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.INVALID_ID);
  });

  it("deletes pizza without cloudinary call when publicId is null", async () => {
    (hasPermission as Mock).mockResolvedValue({ username: "admin" });
    (idValidator.safeParse as Mock).mockReturnValue({
      success: true,
      data: { id: "p1" },
    });

    const result = await deletePizzaAction("p1", null);

    expect(result.success).toBe(true);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.SUCCESS);
    expect(deletePizzaDal).toHaveBeenCalledWith("p1");
    expect(deleteCloudinaryImage).not.toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith("/pizzas");
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard/pizzas");
  });

  it("deletes pizza image from cloudinary when publicId is provided", async () => {
    (hasPermission as Mock).mockResolvedValue({ username: "admin" });
    (idValidator.safeParse as Mock).mockReturnValue({
      success: true,
      data: { id: "p1" },
    });

    const result = await deletePizzaAction("p1", "cloud-public-id");

    expect(result.success).toBe(true);
    expect(deletePizzaDal).toHaveBeenCalledWith("p1");
    expect(deleteCloudinaryImage).toHaveBeenCalledWith("cloud-public-id");
  });

  it("logs with errorLogger in dev mode on error", async () => {
    (hasPermission as Mock).mockRejectedValue(new Error("db error"));

    await deletePizzaAction("p1", null);

    expect(errorLogger).toHaveBeenCalled();
  });

  it("logs with console.error in non-dev mode on error", async () => {
    mockIsDev.mockReturnValue(false);
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    (hasPermission as Mock).mockRejectedValue(new Error("db error"));

    const result = await deletePizzaAction("p1", null);

    expect(consoleSpy).toHaveBeenCalled();
    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.SERVER_ERROR);
    consoleSpy.mockRestore();
  });
});
