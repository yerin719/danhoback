import { relations } from "drizzle-orm";
import { index, pgTable, primaryKey, timestamp, uuid } from "drizzle-orm/pg-core";
import { productVariants } from "../products/schema";
import { profiles } from "../users/schema";

// ============================================
// TABLES
// ============================================

// Favorites table (찜하기) - Simple bridge table
export const favorites = pgTable(
  "favorites",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    productVariantId: uuid("product_variant_id")
      .notNull()
      .references(() => productVariants.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    // 복합 primary key
    pk: primaryKey({ columns: [table.userId, table.productVariantId] }),
    // 인덱스
    productVariantIdx: index("idx_favorites_product_variant").on(table.productVariantId),
    createdIdx: index("idx_favorites_created").on(table.createdAt.desc()),
  }),
);

// ============================================
// RELATIONS
// ============================================

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(profiles, {
    fields: [favorites.userId],
    references: [profiles.id],
  }),
  productVariant: one(productVariants, {
    fields: [favorites.productVariantId],
    references: [productVariants.id],
  }),
}));

// ============================================
// TYPES
// ============================================

export type Favorite = typeof favorites.$inferSelect;
export type NewFavorite = typeof favorites.$inferInsert;
