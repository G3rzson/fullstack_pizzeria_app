import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { deletePastaAction } from "./deletePastaAction";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("../_dal/pastaDal", () => ({ deletePastaDal: vi.fn() }));
vi.mock("@/shared/Functions/idValidator", () => ({
  idValidator: { safeParse: vi.fn() },
}));
vi.mock("@/shared/Functions/hasPermission", () => ({ hasPermission: vi.fn() }));

import { revalidatePath } from "next/cache";
import { deletePastaDal } from "../_dal/pastaDal";
import { idValidator } from "@/shared/Functions/idValidator";
import { hasPermission } from "@/shared/Functions/hasPermission";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";

describe("deletePastaAction", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns invalid data when id is invalid", async () => {
    (hasPermission as Mock).mockResolvedValue({ username: "admin" });
    (idValidator.safeParse as Mock).mockReturnValue({ success: false });

    const result = await deletePastaAction("bad", null);

    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.INVALID_DATA);
  });

  it("deletes pasta and revalidates paths", async () => {
    (hasPermission as Mock).mockResolvedValue({ username: "admin" });
    (idValidator.safeParse as Mock).mockReturnValue({
      success: true,
      data: { id: "t1" },
    });

    const result = await deletePastaAction("t1", null);

    expect(result.success).toBe(true);
    expect(deletePastaDal).toHaveBeenCalledWith("t1");
    expect(revalidatePath).toHaveBeenCalledWith("/pastas");
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard/pastas");
  });
});
