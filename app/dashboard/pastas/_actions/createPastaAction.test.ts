import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { createPastaAction } from "./createPastaAction";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("../_dal/pastaDal", () => ({ createPastaDal: vi.fn() }));
vi.mock("../_validation/pastaSchema", () => ({
  pastaSchema: { safeParseAsync: vi.fn() },
}));
vi.mock("@/shared/Functions/hasPermission", () => ({ hasPermission: vi.fn() }));

import { revalidatePath } from "next/cache";
import { createPastaDal } from "../_dal/pastaDal";
import { pastaSchema } from "../_validation/pastaSchema";
import { hasPermission } from "@/shared/Functions/hasPermission";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";

describe("createPastaAction", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns unauthorized when permission is missing", async () => {
    (hasPermission as Mock).mockResolvedValue(false);

    const result = await createPastaAction({});

    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.UNAUTHORIZED);
  });

  it("creates pasta and revalidates paths", async () => {
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

    const result = await createPastaAction({});

    expect(result.success).toBe(true);
    expect(createPastaDal).toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith("/pastas");
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard/pastas");
  });
});
