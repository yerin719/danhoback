// ============================================
// USER ROLE MAPPING
// ============================================

export const USER_ROLES = {
  user: "일반 사용자",
  admin: "관리자",
} as const;

export type UserRole = keyof typeof USER_ROLES;

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getRoleDisplayName(role: UserRole | null | undefined): string {
  if (!role) return "일반 사용자";
  return USER_ROLES[role] || role;
}

// ============================================
// PERMISSION HELPERS
// ============================================

export function canWriteArticles(role: UserRole | null | undefined): boolean {
  return role === "admin";
}

export function canManageProducts(role: UserRole | null | undefined): boolean {
  return role === "admin";
}

export function canManageUsers(role: UserRole | null | undefined): boolean {
  return role === "admin";
}

export function isAdmin(role: UserRole | null | undefined): boolean {
  return role === "admin";
}

export function isUser(role: UserRole | null | undefined): boolean {
  return role === "user" || !role; // default to user if no role
}

// ============================================
// VALIDATION HELPERS
// ============================================

export function isValidRole(role: string): role is UserRole {
  return Object.keys(USER_ROLES).includes(role as UserRole);
}

// ============================================
// CONSTANTS ARRAYS
// ============================================

export const USER_ROLES_ARRAY = Object.keys(USER_ROLES) as UserRole[];
