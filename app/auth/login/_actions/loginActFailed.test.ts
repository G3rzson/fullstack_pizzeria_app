import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { loginAction } from "./loginAction";
import { LOGIN_INFO } from "../_constants/info";

// Mock bcrypt
vi.mock("bcrypt", () => ({
  default: {
    compare: vi.fn(),
  },
}));

// Mock loginDal
vi.mock("../_dal/loginDal", () => ({
  getUserByUsername: vi.fn(),
}));

// Mock errorLogger
vi.mock("@/shared/Functions/errorLogger", () => ({
  errorLogger: vi.fn(),
}));

// Mock jwt functions
vi.mock("@/shared/Functions/jwt", () => ({
  getJwtSecrets: vi.fn(),
  signAccessToken: vi.fn(),
  signRefreshToken: vi.fn(),
  buildAuthCookieOptions: vi.fn(),
}));

// Mock next cookies
vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

// Mock handleResponse
vi.mock("@/shared/Functions/handleResponse", () => ({
  handleResponse: vi.fn((success: boolean, message: string) => ({
    success,
    message,
  })),
}));

// Importok a mock után
import bcrypt from "bcrypt";
import { getUserByUsername } from "../_dal/loginDal";
import { getJwtSecrets } from "@/shared/Functions/jwt";
import { handleResponse } from "@/shared/Functions/handleResponse";
import { errorLogger } from "@/shared/Functions/errorLogger";

// típusok a mockokhoz
const mockBcryptCompare = bcrypt.compare as unknown as Mock;
const mockGetUserByUsername = getUserByUsername as unknown as Mock;
const mockGetJwtSecrets = getJwtSecrets as unknown as Mock;
const mockHandleResponse = handleResponse as unknown as Mock;
const mockErrorLogger = errorLogger as unknown as Mock;

describe("loginAction - failed scenarios", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return validation error for invalid input", async () => {
    const invalidData = { username: "", password: "" };

    const response = await loginAction(invalidData);

    expect(response.success).toBe(false);
    expect(response.message).toBe(LOGIN_INFO.validationError);
    expect(mockErrorLogger).toHaveBeenCalledWith(
      expect.anything(),
      "loginAction - validation error",
    );
    expect(mockHandleResponse).toHaveBeenCalledWith(
      false,
      LOGIN_INFO.validationError,
    );
    expect(mockGetUserByUsername).not.toHaveBeenCalled();
    expect(mockBcryptCompare).not.toHaveBeenCalled();
    expect(mockGetJwtSecrets).not.toHaveBeenCalled();
  });

  it("should return user not exist error for non-existing user", async () => {
    const validData = { username: "nonexistent", password: "Password1" };
    mockGetUserByUsername.mockResolvedValue(null);

    const response = await loginAction(validData);

    expect(response.success).toBe(false);
    expect(response.message).toBe(LOGIN_INFO.userNotExist);
    expect(mockGetUserByUsername).toHaveBeenCalledWith(validData.username);
    expect(mockHandleResponse).toHaveBeenCalledWith(
      false,
      LOGIN_INFO.userNotExist,
    );
    expect(mockBcryptCompare).not.toHaveBeenCalled();
    expect(mockGetJwtSecrets).not.toHaveBeenCalled();
  });

  it("should return user not exist error for incorrect password", async () => {
    const validData = { username: "existingUser", password: "WrongPassword1" };
    mockGetUserByUsername.mockResolvedValue({
      id: "user-uuid",
      username: "existingUser",
      password: "hashed_password",
      role: "user",
    });
    mockBcryptCompare.mockResolvedValue(false);

    const response = await loginAction(validData);

    expect(response.success).toBe(false);
    expect(response.message).toBe(LOGIN_INFO.userNotExist);
    expect(mockGetUserByUsername).toHaveBeenCalledWith(validData.username);
    expect(mockBcryptCompare).toHaveBeenCalledWith(
      validData.password,
      "hashed_password",
    );
    expect(mockHandleResponse).toHaveBeenCalledWith(
      false,
      LOGIN_INFO.userNotExist,
    );
    expect(mockGetJwtSecrets).not.toHaveBeenCalled();
  });

  it("should return server error if JWT secrets are not defined", async () => {
    const validData = { username: "existingUser", password: "Password123" };
    mockGetUserByUsername.mockResolvedValue({
      id: "user-uuid",
      username: "existingUser",
      password: "hashed_password_123",
      role: "user",
    });
    mockBcryptCompare.mockResolvedValue(true);
    mockGetJwtSecrets.mockReturnValue(null);

    const response = await loginAction(validData);
    expect(response.success).toBe(false);
    expect(response.message).toBe(LOGIN_INFO.serverError);
    expect(mockGetUserByUsername).toHaveBeenCalledWith(validData.username);
    expect(mockBcryptCompare).toHaveBeenCalledWith(
      validData.password,
      "hashed_password_123",
    );
    expect(mockGetJwtSecrets).toHaveBeenCalled();
    expect(mockErrorLogger).toHaveBeenCalledWith(
      expect.anything(),
      "loginAction - JWT secrets error",
    );
    expect(mockHandleResponse).toHaveBeenCalledWith(
      false,
      LOGIN_INFO.serverError,
    );
  });

  it("should return server error on unexpected exception", async () => {
    const validData = { username: "existingUser", password: "Password123" };
    mockGetUserByUsername.mockResolvedValue({
      id: "user-uuid",
      username: "existingUser",
      password: "hashed_password_123",
      role: "user",
    });
    mockBcryptCompare.mockResolvedValue(true);
    mockGetJwtSecrets.mockImplementation(() => {
      throw new Error("Unexpected error");
    });

    const response = await loginAction(validData);

    expect(response.success).toBe(false);
    expect(response.message).toBe(LOGIN_INFO.serverError);
    expect(mockGetUserByUsername).toHaveBeenCalledWith(validData.username);
    expect(mockBcryptCompare).toHaveBeenCalledWith(
      validData.password,
      "hashed_password_123",
    );
    expect(mockGetJwtSecrets).toHaveBeenCalled();
    expect(mockErrorLogger).toHaveBeenCalledWith(
      expect.anything(),
      "loginAction - server error",
    );
    expect(mockHandleResponse).toHaveBeenCalledWith(
      false,
      LOGIN_INFO.serverError,
    );
  });
});
