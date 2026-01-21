import { mapEmailToRole } from "./roleMapper";
import { UserRole } from "../types";

export function resolveEffectiveRole(
  currentRole: UserRole | null,
  email: string | null
): UserRole {
  if (currentRole) {
    return currentRole;
  }
  if (email) {
    return mapEmailToRole(email);
  }
  return UserRole.SALES;
}
