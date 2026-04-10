import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";

const { mockIsDev } = vi.hoisted(() => {
  const mockIsDev = vi.fn();
  return { mockIsDev };
});

vi.mock("../_dal/usersDal", () => ({ getAllUserDal: vi.fn() }));
vi.mock("@/shared/Functions/isDev", () => ({ default: mockIsDev }));
vi.mock("@/shared/Functions/errorLogger", () => ({ errorLogger: vi.fn() }));

import { getAllUserAction } from "./getAllUserAction";
import { getAllUserDal } from "../_dal/usersDal";
import { errorLogger } from "@/shared/Functions/errorLogger";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";

const mockUserWithoutAddress = {
  id: "u1",
  email: "test@test.com",
  username: "tester",
  role: "USER",
  isStillWorkingHere: true,
  orderAddress: null,
};

const mockUserWithAddress = {
  id: "u2",
  email: "admin@test.com",
  username: "admin",
  role: "ADMIN",
  isStillWorkingHere: false,
  orderAddress: {
    id: "a1",
    fullName: "Teszt Elek",
    phoneNumber: "+3611111111",
    postalCode: "1111",
    city: "Budapest",
    street: "Fout",
    houseNumber: "10",
    floorAndDoor: "1/2",
    isSaved: true,
  },
};

describe("getAllUserAction action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsDev.mockReturnValue(true);
  });

  it("returns mapped users with null orderAddress", async () => {
    (getAllUserDal as Mock).mockResolvedValue([mockUserWithoutAddress]);

    const result = await getAllUserAction();

    expect(result.success).toBe(true);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.SUCCESS);
    expect(result.data).toHaveLength(1);
    expect(result.data![0].orderAddress).toBeNull();
  });

  it("returns mapped users with orderAddress data", async () => {
    (getAllUserDal as Mock).mockResolvedValue([mockUserWithAddress]);

    const result = await getAllUserAction();

    expect(result.success).toBe(true);
    expect(result.data![0]).toMatchObject({
      id: "u2",
      email: "admin@test.com",
      isStillWorkingHere: false,
      orderAddress: {
        id: "a1",
        city: "Budapest",
      },
    });
  });

  it("returns server error when dal throws", async () => {
    (getAllUserDal as Mock).mockRejectedValue(new Error("db"));

    const result = await getAllUserAction();

    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.SERVER_ERROR);
  });

  it("logs with errorLogger in dev mode on error", async () => {
    (getAllUserDal as Mock).mockRejectedValue(new Error("db error"));

    await getAllUserAction();

    expect(errorLogger).toHaveBeenCalled();
  });

  it("logs with console.error in non-dev mode on error", async () => {
    mockIsDev.mockReturnValue(false);
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    (getAllUserDal as Mock).mockRejectedValue(new Error("db error"));

    const result = await getAllUserAction();

    expect(consoleSpy).toHaveBeenCalled();
    expect(result.success).toBe(false);
    consoleSpy.mockRestore();
  });
});
