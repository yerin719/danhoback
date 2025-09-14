import { relations } from "drizzle-orm";
import {
  boolean,
  decimal,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// ============================================
// ENUMS
// ============================================

export const flavorCategoryEnum = pgEnum("flavor_category", [
  "chocolate",
  "strawberry",
  "banana",
  "matcha",
  "grain", // 곡물
  "milktea",
  "greentea",
  "coffee",
  "other",
]);

export const proteinTypeEnum = pgEnum("protein_type", [
  "wpi", // 분리유청단백
  "wpc", // 농축유청단백
  "wph", // 가수분해유청단백
  "wpih", // 가수분해분리유청단백
  "casein", // 카제인
  "goat_milk", // 산양유
  "colostrum", // 초유
  "isp", // 분리대두단백
  "spc", // 농축대두단백
  "pea", // 완두단백
  "rice", // 현미단백
  "oat", // 귀리단백
  "mpc", // 농축우유단백
  "mpi", // 분리우유단백
  "egg", // 난백
  "mixed", // 혼합
]);

export const productFormEnum = pgEnum("product_form", [
  "powder", // 파우더
  "rtd", // 드링크 (RTD)
]);

export const packageTypeEnum = pgEnum("package_type", [
  "bulk", // 대용량
  "pouch", // 파우치
  "stick", // 스틱
]);

// ============================================
// TABLES
// ============================================

// Brands table
export const brands = pgTable("brands", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).unique().notNull(),
  nameEn: varchar("name_en", { length: 100 }),
  logoUrl: text("logo_url"),
  website: text("website"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Products table (제품 라인)
export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    brandId: uuid("brand_id")
      .references(() => brands.id)
      .notNull(),
    name: varchar("name", { length: 200 }).notNull(),
    proteinType: proteinTypeEnum("protein_type").notNull(),
    form: productFormEnum("form").default("powder").notNull(),
    // 패키지 정보 (product_variants에서 이동)
    packageType: packageTypeEnum("package_type"),
    totalAmount: decimal("total_amount", { precision: 8, scale: 2 }),
    servingsPerContainer: integer("servings_per_container"),
    servingSize: decimal("serving_size", { precision: 6, scale: 2 }),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      brandIdx: index("idx_products_brand").on(table.brandId),
      proteinTypeIdx: index("idx_products_protein").on(table.proteinType),
    };
  },
);

// Product variants table (실제 SKU)
export const productVariants = pgTable(
  "product_variants",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .references(() => products.id)
      .notNull(),
    slug: varchar("slug", { length: 200 }).unique().notNull(),
    name: varchar("name", { length: 200 }).notNull(),
    flavorCategory: flavorCategoryEnum("flavor_category"),
    flavorName: varchar("flavor_name", { length: 100 }),
    barcode: varchar("barcode", { length: 20 }).unique(),
    primaryImage: text("primary_image"),
    images: jsonb("images").$type<string[]>(),
    purchaseUrl: text("purchase_url"),
    favoritesCount: integer("favorites_count").default(0),
    isAvailable: boolean("is_available").default(true),
    displayOrder: integer("display_order").default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      productIdx: index("idx_variants_product").on(table.productId),
      flavorIdx: index("idx_variants_flavor").on(table.flavorCategory),
      slugIdx: index("idx_variants_slug").on(table.slug),
    };
  },
);

// Variant nutrition table
export const variantNutrition = pgTable("variant_nutrition", {
  id: uuid("id").defaultRandom().primaryKey(),
  variantId: uuid("variant_id")
    .references(() => productVariants.id)
    .unique()
    .notNull(),
  calories: decimal("calories", { precision: 6, scale: 2 }),
  protein: decimal("protein", { precision: 6, scale: 2 }).notNull(),
  carbs: decimal("carbs", { precision: 6, scale: 2 }),
  sugar: decimal("sugar", { precision: 6, scale: 2 }),
  fat: decimal("fat", { precision: 6, scale: 2 }),
  saturatedFat: decimal("saturated_fat", { precision: 6, scale: 2 }),
  unsaturatedFat: decimal("unsaturated_fat", { precision: 6, scale: 2 }),
  transFat: decimal("trans_fat", { precision: 6, scale: 2 }),
  dietaryFiber: decimal("dietary_fiber", { precision: 6, scale: 2 }),
  sodium: decimal("sodium", { precision: 8, scale: 2 }),
  cholesterol: decimal("cholesterol", { precision: 6, scale: 2 }),
  calcium: decimal("calcium", { precision: 8, scale: 2 }),
  additionalNutrients: jsonb("additional_nutrients").$type<Record<string, number>>(),
  allergenInfo: text("allergen_info"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============================================
// RELATIONS
// ============================================

export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  variants: many(productVariants),
}));

export const productVariantsRelations = relations(productVariants, ({ one }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
  nutrition: one(variantNutrition, {
    fields: [productVariants.id],
    references: [variantNutrition.variantId],
  }),
}));

export const variantNutritionRelations = relations(variantNutrition, ({ one }) => ({
  variant: one(productVariants, {
    fields: [variantNutrition.variantId],
    references: [productVariants.id],
  }),
}));
