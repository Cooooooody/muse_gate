import { UserRole } from "../types";

export function mapEmailToRole(email: string): UserRole {
  const normalized = email.trim().toLowerCase();
  if (normalized === "admin@test.com") return UserRole.ADMIN;
  if (normalized === "sales@test.com") return UserRole.SALES;
  if (normalized === "finance@test.com") return UserRole.FINANCE;
  if (normalized === "client@test.com") return UserRole.CLIENT;
  return UserRole.SALES;
}
