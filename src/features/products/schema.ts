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
  "grain", // 곡물
  "chocolate",
  "strawberry",
  "banana",
  "milk", // 우유
  "coffee",
  "original", // 오리지날
  "black_sesame", // 흑임자
  "milktea",
  "greentea",
  "anilla", // 바닐라
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

// Protein Types table (단백질 타입 마스터)
export const proteinTypes = pgTable("protein_types", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: proteinTypeEnum("type").unique().notNull(), // enum 사용
  name: varchar("name", { length: 100 }).notNull(), // 한글명
  description: text("description"), // 설명
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
    description: text("description"), // SEO 메타 description용 제품 설명
    form: productFormEnum("form").default("powder").notNull(),
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
    };
  },
);

// Product Protein Types junction table (다대다 관계)
export const productProteinTypes = pgTable(
  "product_protein_types",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .references(() => products.id, { onDelete: "cascade" })
      .notNull(),
    proteinTypeId: uuid("protein_type_id")
      .references(() => proteinTypes.id, { onDelete: "cascade" })
      .notNull(),
    isPrimary: boolean("is_primary").default(false).notNull(), // 주요 단백질 타입 표시
    percentage: decimal("percentage", { precision: 5, scale: 2 }), // 해당 단백질의 비율 (선택사항)
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      productIdx: index("idx_product_protein_types_product").on(table.productId),
      proteinTypeIdx: index("idx_product_protein_types_protein").on(table.proteinTypeId),
      uniqueProductProtein: index("unique_product_protein").on(
        table.productId,
        table.proteinTypeId,
      ),
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

export const proteinTypesRelations = relations(proteinTypes, ({ many }) => ({
  productProteinTypes: many(productProteinTypes),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  variants: many(productVariants),
  productProteinTypes: many(productProteinTypes),
}));

export const productProteinTypesRelations = relations(productProteinTypes, ({ one }) => ({
  product: one(products, {
    fields: [productProteinTypes.productId],
    references: [products.id],
  }),
  proteinType: one(proteinTypes, {
    fields: [productProteinTypes.proteinTypeId],
    references: [proteinTypes.id],
  }),
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
