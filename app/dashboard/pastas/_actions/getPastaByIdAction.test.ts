import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { getPastaByIdAction } from "./getPastaByIdAction";

vi.mock("../_dal/pastaDal", () => ({ getPastaByIdDal: vi.fn() }));
vi.mock("@/shared/Functions/idValidator", () => ({
  idValidator: { safeParse: vi.fn() },
}));
vi.mock("@/shared/Functions/hasPermission", () => ({ hasPermission: vi.fn() }));

import { getPastaByIdDal } from "../_dal/pastaDal";
import { idValidator } from "@/shared/Functions/idValidator";
import { hasPermission } from "@/shared/Functions/hasPermission";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";

describe("getPastaByIdAction", () => {
  beforeEach(() => vi.clearAllMocks());

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

  it("returns mapped pasta on success", async () => {
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
      image: null,
    });

    const result = await getPastaByIdAction("t1");

    expect(result.success).toBe(true);
    expect(result.data?.id).toBe("t1");
  });
});
