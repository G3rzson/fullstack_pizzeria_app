import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { updatePastaAction } from "./updatePastaAction";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("../_dal/pastaDal", () => ({ updatePastaDal: vi.fn() }));
vi.mock("../_validation/pastaSchema", () => ({
  pastaSchema: { safeParseAsync: vi.fn() },
}));
vi.mock("@/shared/Functions/idValidator", () => ({
  idValidator: { safeParse: vi.fn() },
}));
vi.mock("@/shared/Functions/hasPermission", () => ({ hasPermission: vi.fn() }));

import { revalidatePath } from "next/cache";
import { updatePastaDal } from "../_dal/pastaDal";
import { pastaSchema } from "../_validation/pastaSchema";
import { idValidator } from "@/shared/Functions/idValidator";
import { hasPermission } from "@/shared/Functions/hasPermission";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";

describe("updatePastaAction", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns invalid data when schema fails", async () => {
    (hasPermission as Mock).mockResolvedValue({ username: "admin" });
    (pastaSchema.safeParseAsync as Mock).mockResolvedValue({ success: false });

    const result = await updatePastaAction("t1", {});

    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.INVALID_DATA);
  });

  it("updates pasta and revalidates paths", async () => {
    (hasPermission as Mock).mockResolvedValue({ username: "admin" });
    (pastaSchema.safeParseAsync as Mock).mockResolvedValue({
      success: true,
      data: {
        pastaName: "carbonara",
        pastaPrice: 2800,
        pastaDescription: "classic",
        isAvailableOnMenu: true,
      },
    });
    (idValidator.safeParse as Mock).mockReturnValue({
      success: true,
      data: { id: "t1" },
    });

    const result = await updatePastaAction("t1", {});

    expect(result.success).toBe(true);
    expect(updatePastaDal).toHaveBeenCalledWith("t1", expect.any(Object));
    expect(revalidatePath).toHaveBeenCalledWith("/pastas");
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard/pastas");
  });
});
