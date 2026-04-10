import { describe, it, expect, vi, beforeEach } from "vitest";
import { registerDal } from "./registerDal";

vi.mock("@/prisma/prisma", () => ({
  default: {
    user: {
      create: vi.fn(),
    },
  },
}));

import prisma from "@/prisma/prisma";

describe("registerDal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls prisma.user.create with provided data", async () => {
    const newUser = {
      username: "tester",
      email: "test@example.com",
      password: "hashed",
    };

    await registerDal(newUser);

    expect(prisma.user.create).toHaveBeenCalledWith({ data: newUser });
  });
});
