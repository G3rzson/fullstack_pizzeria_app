import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { registerAction } from "./registerAction";
import { Prisma } from "@prisma/client";

// Mock bcrypt
vi.mock("bcrypt", () => ({
  default: {
    hash: vi.fn(),
  },
}));

// Mock registerDal
vi.mock("../_dal/registerDal", () => ({
  registerDal: vi.fn(),
}));

// Mock errorLogger
vi.mock("@/shared/Functions/errorLogger", () => ({
  errorLogger: vi.fn(),
}));

// Importok a mock után
import bcrypt from "bcrypt";
import { registerDal } from "../_dal/registerDal";
import { errorLogger } from "@/shared/Functions/errorLogger";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";

// típusok a mockokhoz
const mockBcryptHash = bcrypt.hash as unknown as Mock;
const mockRegisterDal = registerDal as unknown as Mock;
const mockErrorLogger = errorLogger as unknown as Mock;

describe("registerAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully register a new user with valid data", async () => {
    const mockData = {
      username: "TestUser",
      email: "test@example.com",
      password: "Password123",
    };

    mockBcryptHash.mockResolvedValue("hashed_password_123");
    mockRegisterDal.mockResolvedValue({
      id: "user-uuid",
      username: mockData.username,
      email: mockData.email,
    });

    const result = await registerAction(mockData);

    expect(result.success).toBe(true);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.SUCCESS);
    expect(mockBcryptHash).toHaveBeenCalledWith("Password123", 10);
    expect(mockRegisterDal).toHaveBeenCalledWith({
      username: "TestUser",
      email: "test@example.com",
      password: "hashed_password_123",
    });
  });

  it("should return validation error for invalid data", async () => {
    const invalidData = {
      username: "",
      email: "invalid-email",
      password: "short",
    };

    const result = await registerAction(invalidData);

    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.INVALID_DATA);
    expect(mockErrorLogger).toHaveBeenCalledWith(
      expect.any(Object),
      "registerAction - validation error",
    );
    expect(mockRegisterDal).not.toHaveBeenCalled();
  });

  it("should return duplicate error when email or username already exists", async () => {
    const mockData = {
      username: "ExistingUser",
      email: "existing@example.com",
      password: "Password123",
    };

    mockBcryptHash.mockResolvedValue("hashed_password");

    const prismaError = new Prisma.PrismaClientKnownRequestError(
      "Unique constraint failed",
      {
        code: "P2002",
        clientVersion: "5.0.0",
        meta: { target: ["email"] },
      },
    );

    mockRegisterDal.mockRejectedValue(prismaError);

    const result = await registerAction(mockData);

    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.DUPLICATE_ERROR);
    expect(mockErrorLogger).toHaveBeenCalledWith(
      prismaError,
      "registerAction - db duplicate error",
    );
  });

  it("should return server error for unexpected errors", async () => {
    const mockData = {
      username: "TestUser",
      email: "test@example.com",
      password: "Password123",
    };

    mockBcryptHash.mockRejectedValue(new Error("Bcrypt failed"));

    const result = await registerAction(mockData);

    expect(result.success).toBe(false);
    expect(result.message).toBe(BACKEND_RESPONSE_MESSAGES.SERVER_ERROR);
    expect(mockErrorLogger).toHaveBeenCalledWith(
      expect.any(Error),
      "registerAction - server error",
    );
  });

  it("should hash password with bcrypt salt 10", async () => {
    const mockData = {
      username: "TestUser",
      email: "test@example.com",
      password: "MyPassword123",
    };

    mockBcryptHash.mockResolvedValue("hashed_pass");
    mockRegisterDal.mockResolvedValue({ id: "uuid" });

    await registerAction(mockData);

    expect(mockBcryptHash).toHaveBeenCalledWith("MyPassword123", 10);
  });
});
