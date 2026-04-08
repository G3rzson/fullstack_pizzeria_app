import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { getAllPastaAction } from "./getAllPastaAction";

vi.mock("../_dal/pastaDal", () => ({ getAllPastaDal: vi.fn() }));

import { getAllPastaDal } from "../_dal/pastaDal";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";

describe("getAllPastaAction", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns mapped pastas on success", async () => {
    (getAllPastaDal as Mock).mockResolvedValue([
      {
        id: "t1",
        pastaName: "carbonara",
        pastaPrice: 2800,
        pastaDescription: "classic",
        isAvailableOnMenu: true,
        image: null,
      },
    ]);

    const result = await getAllPastaAction();

    expect(result.success).toBe(true);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.SUCCESS);
    expect(result.data).toHaveLength(1);
  });

  it("returns server error when dal throws", async () => {
    (getAllPastaDal as Mock).mockRejectedValue(new Error("db"));

    const result = await getAllPastaAction();

    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.SERVER_ERROR);
  });
});
