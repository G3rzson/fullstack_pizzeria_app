import { describe, it, expect } from "vitest";
import { priceFormatter } from "./priceFormatter";

describe("Price Formatter", () => {
  it("should contain the Ft symbol", () => {
    expect(priceFormatter(1000)).toContain("Ft");
  });
});
