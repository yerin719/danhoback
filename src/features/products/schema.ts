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
  uniqueIndex,
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
  "vanilla", // 바닐라
  "corn", // 옥수수
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
// CORE TABLES
// ============================================

// Brands table (기존 유지)
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

// Protein Types table (기존 유지)
export const proteinTypes = pgTable("protein_types", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: proteinTypeEnum("type").unique().notNull(),
  name: varchar("name", { length: 100 }).notNull(), // 한글명
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============================================
// PRODUCT LINE LEVEL TABLES
// ============================================

// Product Lines table (제품 라인 - 예: 골드 스탠다드 웨이)
export const productLines = pgTable(
  "product_lines",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    brandId: uuid("brand_id")
      .references(() => brands.id)
      .notNull(),
    name: varchar("name", { length: 200 }).notNull(), // "골드 스탠다드 웨이"
    description: text("description"),
    form: productFormEnum("form").default("powder").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      brandIdx: index("idx_product_lines_brand").on(table.brandId),
      nameIdx: index("idx_product_lines_name").on(table.name),
    };
  },
);

// Line Flavors table (제품 라인의 맛 - 예: 골드 스탠다드 웨이 초콜릿)
export const lineFlavors = pgTable(
  "line_flavors",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    lineId: uuid("line_id")
      .references(() => productLines.id)
      .notNull(),
    flavorCategory: flavorCategoryEnum("flavor_category"),
    flavorName: varchar("flavor_name", { length: 100 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      lineIdx: index("idx_line_flavors_line").on(table.lineId),
      flavorIdx: index("idx_line_flavors_flavor").on(table.flavorCategory),
      uniqueLineFlavor: index("unique_line_flavor").on(table.lineId, table.flavorName),
    };
  },
);

// Nutrition Info table (영양정보 - Line Flavor와 1:1)
export const nutritionInfo = pgTable("nutrition_info", {
  id: uuid("id").defaultRandom().primaryKey(),
  lineFlavorId: uuid("line_flavor_id")
    .references(() => lineFlavors.id)
    .unique()
    .notNull(),
  servingSize: decimal("serving_size", { precision: 6, scale: 2 }),
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

// Line Flavor Protein Types junction table (맛별 단백질 타입 - N:M)
export const lineFlavorProteinTypes = pgTable(
  "line_flavor_protein_types",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    lineFlavorId: uuid("line_flavor_id")
      .references(() => lineFlavors.id, { onDelete: "cascade" })
      .notNull(),
    proteinTypeId: uuid("protein_type_id")
      .references(() => proteinTypes.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      lineFlavorIdx: index("idx_line_flavor_protein_types_flavor").on(table.lineFlavorId),
      proteinTypeIdx: index("idx_line_flavor_protein_types_protein").on(table.proteinTypeId),
      uniqueFlavorProtein: index("unique_line_flavor_protein").on(
        table.lineFlavorId,
        table.proteinTypeId,
      ),
    };
  },
);

// ============================================
// PRODUCT LEVEL TABLES
// ============================================

// Products table (제품 - 라인 + 패키지타입, 예: 골드 스탠다드 웨이 벌크)
export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    lineId: uuid("line_id")
      .references(() => productLines.id)
      .notNull(),
    packageType: packageTypeEnum("package_type").notNull(),
    size: varchar("size", { length: 50 }),
    servingsPerContainer: integer("servings_per_container"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      lineIdx: index("idx_products_line").on(table.lineId),
      packageTypeIdx: index("idx_products_package_type").on(table.packageType),
      uniqueLinePackage: uniqueIndex("unique_line_package").on(table.lineId, table.packageType),
    };
  },
);

// Product Flavors table (제품별 맛 매핑)
export const productFlavors = pgTable(
  "product_flavors",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .references(() => products.id)
      .notNull(),
    lineFlavorId: uuid("line_flavor_id")
      .references(() => lineFlavors.id)
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      productIdx: index("idx_product_flavors_product").on(table.productId),
      lineFlavorIdx: index("idx_product_flavors_line_flavor").on(table.lineFlavorId),
      uniqueProductFlavor: index("unique_product_flavor").on(table.productId, table.lineFlavorId),
    };
  },
);

// Product SKUs table (최종 판매 단위)
export const productSkus = pgTable(
  "product_skus",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productFlavorId: uuid("product_flavor_id")
      .references(() => productFlavors.id)
      .notNull(),
    barcode: varchar("barcode", { length: 20 }).unique(),
    slug: varchar("slug", { length: 255 }).unique().notNull(),
    name: varchar("name", { length: 200 }).notNull(),
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
      productFlavorIdx: index("idx_skus_product_flavor").on(table.productFlavorId),
      barcodeIdx: index("idx_skus_barcode").on(table.barcode),
    };
  },
);

// ============================================
// RELATIONS
// ============================================

// Brand relations
export const brandsRelations = relations(brands, ({ many }) => ({
  productLines: many(productLines),
}));

// Product Line relations
export const productLinesRelations = relations(productLines, ({ one, many }) => ({
  brand: one(brands, {
    fields: [productLines.brandId],
    references: [brands.id],
  }),
  lineFlavors: many(lineFlavors),
  products: many(products),
}));

// Line Flavor relations
export const lineFlavorsRelations = relations(lineFlavors, ({ one, many }) => ({
  line: one(productLines, {
    fields: [lineFlavors.lineId],
    references: [productLines.id],
  }),
  nutritionInfo: one(nutritionInfo, {
    fields: [lineFlavors.id],
    references: [nutritionInfo.lineFlavorId],
  }),
  proteinTypes: many(lineFlavorProteinTypes),
  productFlavors: many(productFlavors),
}));

// Nutrition Info relations
export const nutritionInfoRelations = relations(nutritionInfo, ({ one }) => ({
  lineFlavor: one(lineFlavors, {
    fields: [nutritionInfo.lineFlavorId],
    references: [lineFlavors.id],
  }),
}));

// Line Flavor Protein Types relations
export const lineFlavorProteinTypesRelations = relations(lineFlavorProteinTypes, ({ one }) => ({
  lineFlavor: one(lineFlavors, {
    fields: [lineFlavorProteinTypes.lineFlavorId],
    references: [lineFlavors.id],
  }),
  proteinType: one(proteinTypes, {
    fields: [lineFlavorProteinTypes.proteinTypeId],
    references: [proteinTypes.id],
  }),
}));

// Protein Types relations
export const proteinTypesRelations = relations(proteinTypes, ({ many }) => ({
  lineFlavorProteinTypes: many(lineFlavorProteinTypes),
}));

// Products relations
export const productsRelations = relations(products, ({ one, many }) => ({
  line: one(productLines, {
    fields: [products.lineId],
    references: [productLines.id],
  }),
  productFlavors: many(productFlavors),
}));

// Product Flavors relations
export const productFlavorsRelations = relations(productFlavors, ({ one, many }) => ({
  product: one(products, {
    fields: [productFlavors.productId],
    references: [products.id],
  }),
  lineFlavor: one(lineFlavors, {
    fields: [productFlavors.lineFlavorId],
    references: [lineFlavors.id],
  }),
  skus: many(productSkus),
}));

// Product SKUs relations
export const productSkusRelations = relations(productSkus, ({ one }) => ({
  productFlavor: one(productFlavors, {
    fields: [productSkus.productFlavorId],
    references: [productFlavors.id],
  }),
}));
