import { pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

// ============================================
// ENUMS
// ============================================

export const userRoleEnum = pgEnum("user_role", [
  "user", // 일반 사용자
  "admin", // 관리자
]);

// ============================================
// TABLES
// ============================================

// Profiles table
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(), // References auth.users(id)
  username: varchar("username", { length: 100 }).notNull(),
  avatarUrl: text("avatar_url"),
  role: userRoleEnum("role").default("user"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============================================
// RELATIONS
// ============================================

// Note: auth.users 테이블은 Supabase에서 관리하므로 여기서는 relation 정의하지 않음
// 필요시 애플리케이션 레벨에서 JOIN 처리
