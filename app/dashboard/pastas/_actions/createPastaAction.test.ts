import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";

const { mockIsDev } = vi.hoisted(() => {
  const mockIsDev = vi.fn();
  return { mockIsDev };
});

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("../_dal/pastaDal", () => ({ createPastaDal: vi.fn() }));
vi.mock("../_validation/pastaSchema", () => ({
  pastaSchema: { safeParseAsync: vi.fn() },
}));
vi.mock("@/shared/Functions/hasPermission", () => ({ hasPermission: vi.fn() }));
vi.mock("@/shared/Functions/isDev", () => ({ default: mockIsDev }));
vi.mock("@/shared/Functions/errorLogger", () => ({ errorLogger: vi.fn() }));

import { createPastaAction } from "./createPastaAction";
import { revalidatePath } from "next/cache";
import { createPastaDal } from "../_dal/pastaDal";
import { pastaSchema } from "../_validation/pastaSchema";
import { hasPermission } from "@/shared/Functions/hasPermission";
import { errorLogger } from "@/shared/Functions/errorLogger";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";

describe("createPastaAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsDev.mockReturnValue(true);
  });

  it("returns unauthorized when permission is missing", async () => {
    (hasPermission as Mock).mockResolvedValue(false);

    const result = await createPastaAction({});

    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.UNAUTHORIZED);
  });

  it("returns invalid data when schema validation fails", async () => {
    (hasPermission as Mock).mockResolvedValue({ username: "admin" });
    (pastaSchema.safeParseAsync as Mock).mockResolvedValue({ success: false });

    const result = await createPastaAction({});

    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.INVALID_DATA);
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
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.SUCCESS);
    expect(createPastaDal).toHaveBeenCalledWith(
      expect.objectContaining({ category: "pasták", createdBy: "admin" }),
    );
    expect(revalidatePath).toHaveBeenCalledWith("/pastas");
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard/pastas");
  });

  it("logs with errorLogger in dev mode on error", async () => {
    (hasPermission as Mock).mockRejectedValue(new Error("db error"));

    await createPastaAction({});

    expect(errorLogger).toHaveBeenCalled();
  });

  it("logs with console.error in non-dev mode on error", async () => {
    mockIsDev.mockReturnValue(false);
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    (hasPermission as Mock).mockRejectedValue(new Error("db error"));

    const result = await createPastaAction({});

    expect(consoleSpy).toHaveBeenCalled();
    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.SERVER_ERROR);
    consoleSpy.mockRestore();
  });
});
