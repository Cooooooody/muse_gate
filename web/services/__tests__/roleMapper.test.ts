import { describe, expect, it } from "vitest";
import {
  mapEmailToRole,
  mapStoredRoleToUserRole,
  mapUserRoleToStoredRole
} from "../roleMapper";
import { UserRole } from "../../types";

describe("mapEmailToRole", () => {
  it("maps known test emails", () => {
    expect(mapEmailToRole("admin@test.com")).toBe(UserRole.ADMIN);
    expect(mapEmailToRole("sales@test.com")).toBe(UserRole.SALES);
    expect(mapEmailToRole("finance@test.com")).toBe(UserRole.FINANCE);
    expect(mapEmailToRole("client@test.com")).toBe(UserRole.CLIENT);
  });
});

describe("mapStoredRoleToUserRole", () => {
  it("maps stored roles to display roles", () => {
    expect(mapStoredRoleToUserRole("admin")).toBe(UserRole.ADMIN);
    expect(mapStoredRoleToUserRole("sales")).toBe(UserRole.SALES);
    expect(mapStoredRoleToUserRole("finance")).toBe(UserRole.FINANCE);
    expect(mapStoredRoleToUserRole("client")).toBe(UserRole.CLIENT);
  });

  it("defaults to sales for unknown roles", () => {
    expect(mapStoredRoleToUserRole("unknown")).toBe(UserRole.SALES);
  });
});

describe("mapUserRoleToStoredRole", () => {
  it("maps display roles to stored roles", () => {
    expect(mapUserRoleToStoredRole(UserRole.ADMIN)).toBe("admin");
    expect(mapUserRoleToStoredRole(UserRole.SALES)).toBe("sales");
    expect(mapUserRoleToStoredRole(UserRole.FINANCE)).toBe("finance");
    expect(mapUserRoleToStoredRole(UserRole.CLIENT)).toBe("client");
  });
});
