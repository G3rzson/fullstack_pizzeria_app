import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { getUserFromCookie } from "./getUserFromCookie";
import { cookies } from "next/headers";
import { getJwtSecrets, verifyAccessToken } from "./jwt";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("./jwt", () => ({
  getJwtSecrets: vi.fn(),
  verifyAccessToken: vi.fn(),
}));

const mockCookies = cookies as unknown as Mock;
const mockGetJwtSecrets = getJwtSecrets as unknown as Mock;
const mockVerifyAccessToken = verifyAccessToken as unknown as Mock;

describe("getUserFromCookie", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null when access token is missing", async () => {
    mockCookies.mockResolvedValue({ get: vi.fn(() => undefined) });

    expect(await getUserFromCookie()).toBeNull();
    expect(mockGetJwtSecrets).not.toHaveBeenCalled();
  });

  it("returns null when jwt secrets are missing", async () => {
    mockCookies.mockResolvedValue({
      get: vi.fn(() => ({ value: "token" })),
    });
    mockGetJwtSecrets.mockReturnValue(null);

    expect(await getUserFromCookie()).toBeNull();
    expect(mockVerifyAccessToken).not.toHaveBeenCalled();
  });

  it("returns null when token verification fails", async () => {
    mockCookies.mockResolvedValue({
      get: vi.fn(() => ({ value: "token" })),
    });
    mockGetJwtSecrets.mockReturnValue({ accessTokenSecret: "secret" });
    mockVerifyAccessToken.mockReturnValue(null);

    expect(await getUserFromCookie()).toBeNull();
  });

  it("returns user data when token is valid", async () => {
    mockCookies.mockResolvedValue({
      get: vi.fn(() => ({ value: "token" })),
    });
    mockGetJwtSecrets.mockReturnValue({ accessTokenSecret: "secret" });
    mockVerifyAccessToken.mockReturnValue({
      id: "u1",
      username: "tester",
      role: "ADMIN",
      iat: 1,
      exp: 2,
    });

    expect(await getUserFromCookie()).toEqual({
      id: "u1",
      username: "tester",
      role: "ADMIN",
    });
  });
});
