import { StoredUserRole, UserRole } from "../types";

export function mapEmailToRole(email: string): UserRole {
  const normalized = email.trim().toLowerCase();
  if (normalized === "admin@test.com") return UserRole.ADMIN;
  if (normalized === "sales@test.com") return UserRole.SALES;
  if (normalized === "finance@test.com") return UserRole.FINANCE;
  if (normalized === "client@test.com") return UserRole.CLIENT;
  return UserRole.SALES;
}

export function mapStoredRoleToUserRole(role: string | null | undefined): UserRole {
  if (role === "admin") return UserRole.ADMIN;
  if (role === "sales") return UserRole.SALES;
  if (role === "finance") return UserRole.FINANCE;
  if (role === "client") return UserRole.CLIENT;
  if (role === "supervisor") return UserRole.SUPERVISOR;
  return UserRole.SALES;
}

export function mapUserRoleToStoredRole(role: UserRole): StoredUserRole {
  if (role === UserRole.ADMIN) return "admin";
  if (role === UserRole.SALES) return "sales";
  if (role === UserRole.FINANCE) return "finance";
  if (role === UserRole.CLIENT) return "client";
  return "supervisor";
}
