import { describe, expect, it } from "vitest";
import { resolveEffectiveRole } from "../roleResolver";
import { UserRole } from "../../types";

describe("resolveEffectiveRole", () => {
  it("returns current role when set", () => {
    expect(resolveEffectiveRole(UserRole.FINANCE, "sales@test.com")).toBe(
      UserRole.FINANCE
    );
  });

  it("falls back to email mapping when role missing", () => {
    expect(resolveEffectiveRole(null, "sales@test.com")).toBe(UserRole.SALES);
  });

  it("defaults to sales when role and email missing", () => {
    expect(resolveEffectiveRole(null, null)).toBe(UserRole.SALES);
  });
});
