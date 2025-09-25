import { relations } from "drizzle-orm";
import { index, pgTable, primaryKey, timestamp, uuid } from "drizzle-orm/pg-core";
import { productSkus } from "../products/schema";
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
    productSkuId: uuid("product_sku_id")
      .notNull()
      .references(() => productSkus.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    // 복합 primary key
    pk: primaryKey({ columns: [table.userId, table.productSkuId] }),
    // 인덱스
    productSkuIdx: index("idx_favorites_product_sku").on(table.productSkuId),
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
  productSku: one(productSkus, {
    fields: [favorites.productSkuId],
    references: [productSkus.id],
  }),
}));

// ============================================
// TYPES
// ============================================

export type Favorite = typeof favorites.$inferSelect;
export type NewFavorite = typeof favorites.$inferInsert;
