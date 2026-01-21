import { describe, expect, it } from "vitest";
import { mapEmailToRole } from "../roleMapper";
import { UserRole } from "../../types";

describe("mapEmailToRole", () => {
  it("maps known local emails", () => {
    expect(mapEmailToRole("admin@musegate.local")).toBe(UserRole.ADMIN);
    expect(mapEmailToRole("sales@musegate.local")).toBe(UserRole.SALES);
    expect(mapEmailToRole("finance@musegate.local")).toBe(UserRole.FINANCE);
    expect(mapEmailToRole("client@musegate.local")).toBe(UserRole.CLIENT);
  });
});
