import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { getAllUserAction } from "./getAllUserAction";

vi.mock("../_dal/usersDal", () => ({ getAllUserDal: vi.fn() }));

import { getAllUserDal } from "../_dal/usersDal";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";

describe("getAllUserAction", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns mapped users on success", async () => {
    (getAllUserDal as Mock).mockResolvedValue([
      {
        id: "u1",
        email: "test@test.com",
        username: "tester",
        role: "USER",
        orderAddress: null,
      },
    ]);

    const result = await getAllUserAction();

    expect(result.success).toBe(true);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.SUCCESS);
    expect(result.data).toEqual([
      {
        id: "u1",
        email: "test@test.com",
        username: "tester",
        role: "USER",
        orderAddress: null,
      },
    ]);
  });

  it("returns server error when dal throws", async () => {
    (getAllUserDal as Mock).mockRejectedValue(new Error("db"));

    const result = await getAllUserAction();

    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.SERVER_ERROR);
  });
});
