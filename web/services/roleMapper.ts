import { UserRole } from "../types";

export function mapEmailToRole(email: string): UserRole {
  const normalized = email.trim().toLowerCase();
  if (normalized === "admin@musegate.local") return UserRole.ADMIN;
  if (normalized === "sales@musegate.local") return UserRole.SALES;
  if (normalized === "finance@musegate.local") return UserRole.FINANCE;
  if (normalized === "client@musegate.local") return UserRole.CLIENT;
  return UserRole.SALES;
}
