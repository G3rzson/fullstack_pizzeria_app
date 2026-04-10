import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";

const { mockIsDev } = vi.hoisted(() => {
  const mockIsDev = vi.fn();
  return { mockIsDev };
});

vi.mock("../_dal/pastaDal", () => ({ getPastaByIdDal: vi.fn() }));
vi.mock("@/shared/Functions/idValidator", () => ({
  idValidator: { safeParse: vi.fn() },
}));
vi.mock("@/shared/Functions/hasPermission", () => ({ hasPermission: vi.fn() }));
vi.mock("@/shared/Functions/isDev", () => ({ default: mockIsDev }));
vi.mock("@/shared/Functions/errorLogger", () => ({ errorLogger: vi.fn() }));

import { getPastaByIdAction } from "./getPastaByIdAction";
import { getPastaByIdDal } from "../_dal/pastaDal";
import { idValidator } from "@/shared/Functions/idValidator";
import { hasPermission } from "@/shared/Functions/hasPermission";
import { errorLogger } from "@/shared/Functions/errorLogger";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";

describe("getPastaByIdAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsDev.mockReturnValue(true);
  });

  it("returns unauthorized when permission check fails", async () => {
    (hasPermission as Mock).mockResolvedValue(false);

    const result = await getPastaByIdAction("t1");

    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.UNAUTHORIZED);
  });

  it("returns invalid id when validator fails", async () => {
    (hasPermission as Mock).mockResolvedValue({ username: "admin" });
    (idValidator.safeParse as Mock).mockReturnValue({ success: false });

    const result = await getPastaByIdAction("bad");

    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.INVALID_ID);
  });

  it("returns not found when dal returns null", async () => {
    (hasPermission as Mock).mockResolvedValue({ username: "admin" });
    (idValidator.safeParse as Mock).mockReturnValue({
      success: true,
      data: { id: "t1" },
    });
    (getPastaByIdDal as Mock).mockResolvedValue(null);

    const result = await getPastaByIdAction("t1");

    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.NOT_FOUND);
  });

  it("returns mapped pasta with image on success", async () => {
    (hasPermission as Mock).mockResolvedValue({ username: "admin" });
    (idValidator.safeParse as Mock).mockReturnValue({
      success: true,
      data: { id: "t1" },
    });
    (getPastaByIdDal as Mock).mockResolvedValue({
      id: "t1",
      pastaName: "carbonara",
      pastaPrice: 2800,
      pastaDescription: "classic",
      isAvailableOnMenu: true,
      image: {
        id: "img1",
        pastaId: "t1",
        publicId: "cloud-id",
        publicUrl: "https://img.url/pasta.png",
        originalName: "pasta.png",
      },
    });

    const result = await getPastaByIdAction("t1");

    expect(result.success).toBe(true);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.SUCCESS);
    expect(result.data?.id).toBe("t1");
    expect(result.data?.image?.publicId).toBe("cloud-id");
  });

  it("logs with errorLogger in dev mode on error", async () => {
    (hasPermission as Mock).mockRejectedValue(new Error("db error"));

    await getPastaByIdAction("t1");

    expect(errorLogger).toHaveBeenCalled();
  });

  it("logs with console.error in non-dev mode on error", async () => {
    mockIsDev.mockReturnValue(false);
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    (hasPermission as Mock).mockRejectedValue(new Error("db error"));

    const result = await getPastaByIdAction("t1");

    expect(consoleSpy).toHaveBeenCalled();
    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.SERVER_ERROR);
    consoleSpy.mockRestore();
  });
});
