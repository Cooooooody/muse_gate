import { describe, expect, it } from "vitest";
import { mapEmailToRole } from "../roleMapper";
import { UserRole } from "../../types";

describe("mapEmailToRole", () => {
  it("maps known local emails", () => {
    expect(mapEmailToRole("admin@test.com")).toBe(UserRole.ADMIN);
    expect(mapEmailToRole("sales@test.com")).toBe(UserRole.SALES);
    expect(mapEmailToRole("finance@test.com")).toBe(UserRole.FINANCE);
    expect(mapEmailToRole("client@test.com")).toBe(UserRole.CLIENT);
  });
});
