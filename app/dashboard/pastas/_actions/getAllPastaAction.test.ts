import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";

const { mockIsDev } = vi.hoisted(() => {
  const mockIsDev = vi.fn();
  return { mockIsDev };
});

vi.mock("../_dal/pastaDal", () => ({ getAllPastaDal: vi.fn() }));
vi.mock("@/shared/Functions/isDev", () => ({ default: mockIsDev }));
vi.mock("@/shared/Functions/errorLogger", () => ({ errorLogger: vi.fn() }));

import { getAllPastaAction } from "./getAllPastaAction";
import { getAllPastaDal } from "../_dal/pastaDal";
import { errorLogger } from "@/shared/Functions/errorLogger";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";

const mockPasta = {
  id: "t1",
  pastaName: "carbonara",
  pastaPrice: 2800,
  pastaDescription: "classic",
  isAvailableOnMenu: true,
  image: null,
};

const mockPastaWithImage = {
  ...mockPasta,
  image: {
    id: "img1",
    pastaId: "t1",
    publicId: "cloud-id",
    publicUrl: "https://img.url/pasta.png",
    originalName: "pasta.png",
  },
};

describe("getAllPastaAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsDev.mockReturnValue(true);
  });

  it("returns mapped pastas with null image", async () => {
    (getAllPastaDal as Mock).mockResolvedValue([mockPasta]);

    const result = await getAllPastaAction();

    expect(result.success).toBe(true);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.SUCCESS);
    expect(result.data).toHaveLength(1);
    expect(result.data![0].image).toBeNull();
  });

  it("returns mapped pastas with image data", async () => {
    (getAllPastaDal as Mock).mockResolvedValue([mockPastaWithImage]);

    const result = await getAllPastaAction();

    expect(result.success).toBe(true);
    expect(result.data![0].image).toMatchObject({
      id: "img1",
      publicId: "cloud-id",
    });
  });

  it("returns server error when dal throws", async () => {
    (getAllPastaDal as Mock).mockRejectedValue(new Error("db"));

    const result = await getAllPastaAction();

    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.SERVER_ERROR);
  });

  it("logs with errorLogger in dev mode on error", async () => {
    (getAllPastaDal as Mock).mockRejectedValue(new Error("db error"));

    await getAllPastaAction();

    expect(errorLogger).toHaveBeenCalled();
  });

  it("logs with console.error in non-dev mode on error", async () => {
    mockIsDev.mockReturnValue(false);
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    (getAllPastaDal as Mock).mockRejectedValue(new Error("db error"));

    const result = await getAllPastaAction();

    expect(consoleSpy).toHaveBeenCalled();
    expect(result.success).toBe(false);
    consoleSpy.mockRestore();
  });
});
