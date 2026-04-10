import { describe, it, expect, afterEach, vi } from "vitest";
import isDev from "./isDev";

describe("isDev", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("should return false in production environment", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(isDev()).toBe(false);
  });

  it("should return true in development environment", () => {
    vi.stubEnv("NODE_ENV", "development");
    expect(isDev()).toBe(true);
  });

  it("should return true in test environment", () => {
    vi.stubEnv("NODE_ENV", "test");
    expect(isDev()).toBe(true);
  });

  it("should return true when NODE_ENV is undefined", () => {
    vi.stubEnv("NODE_ENV", undefined);
    expect(isDev()).toBe(true);
  });
});
