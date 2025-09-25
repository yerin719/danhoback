CREATE TABLE "line_flavor_protein_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"line_flavor_id" uuid NOT NULL,
	"protein_type_id" uuid NOT NULL,
	"percentage" numeric(5, 2),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "line_flavors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"line_id" uuid NOT NULL,
	"flavor_category" "flavor_category",
	"flavor_name" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_flavors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"line_flavor_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand_id" uuid NOT NULL,
	"name" varchar(200) NOT NULL,
	"description" text,
	"form" "product_form" DEFAULT 'powder' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_skus" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_flavor_id" uuid NOT NULL,
	"barcode" varchar(20),
	"name" varchar(200) NOT NULL,
	"size" varchar(50) NOT NULL,
	"servings_per_container" integer,
	"primary_image" text,
	"images" jsonb,
	"purchase_url" text,
	"favorites_count" integer DEFAULT 0,
	"is_available" boolean DEFAULT true,
	"display_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "product_skus_barcode_unique" UNIQUE("barcode")
);
--> statement-breakpoint
ALTER TABLE "product_variants" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "variant_protein_types" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "product_variants" CASCADE;--> statement-breakpoint
DROP TABLE "variant_protein_types" CASCADE;--> statement-breakpoint
ALTER TABLE "variant_nutrition" RENAME TO "nutrition_info";--> statement-breakpoint
ALTER TABLE "favorites" RENAME COLUMN "product_variant_id" TO "product_sku_id";--> statement-breakpoint
-- 제약 조건들을 안전하게 제거
DO $$
BEGIN
    -- nutrition_info (variant_nutrition) 유니크 제약 제거
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'variant_nutrition_variant_id_unique'
        AND table_name = 'nutrition_info'
    ) THEN
        ALTER TABLE "nutrition_info" DROP CONSTRAINT "variant_nutrition_variant_id_unique";
    END IF;

    -- favorites 외래키 제약 제거
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'favorites_product_variant_id_product_variants_id_fk'
        AND table_name = 'favorites'
    ) THEN
        ALTER TABLE "favorites" DROP CONSTRAINT "favorites_product_variant_id_product_variants_id_fk";
    END IF;

    -- products 브랜드 외래키 제약 제거
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'products_brand_id_brands_id_fk'
        AND table_name = 'products'
    ) THEN
        ALTER TABLE "products" DROP CONSTRAINT "products_brand_id_brands_id_fk";
    END IF;

    -- nutrition_info (variant_nutrition) 외래키 제약 제거
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'variant_nutrition_variant_id_product_variants_id_fk'
        AND table_name = 'nutrition_info'
    ) THEN
        ALTER TABLE "nutrition_info" DROP CONSTRAINT "variant_nutrition_variant_id_product_variants_id_fk";
    END IF;
END $$;
--> statement-breakpoint
ALTER TABLE "line_flavors" ALTER COLUMN "flavor_category" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."flavor_category";--> statement-breakpoint
CREATE TYPE "public"."flavor_category" AS ENUM('grain', 'chocolate', 'strawberry', 'banana', 'milk', 'coffee', 'original', 'black_sesame', 'milktea', 'greentea', 'vanilla', 'corn', 'other');--> statement-breakpoint
ALTER TABLE "line_flavors" ALTER COLUMN "flavor_category" SET DATA TYPE "public"."flavor_category" USING "flavor_category"::"public"."flavor_category";--> statement-breakpoint
-- 인덱스와 PK 안전하게 제거
DO $$
BEGIN
    -- 인덱스 제거
    DROP INDEX IF EXISTS "idx_favorites_product_variant";
    DROP INDEX IF EXISTS "idx_products_brand";

    -- Primary Key 제약 제거
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'favorites_user_id_product_variant_id_pk'
        AND table_name = 'favorites'
    ) THEN
        ALTER TABLE "favorites" DROP CONSTRAINT "favorites_user_id_product_variant_id_pk";
    ELSIF EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'favorites_pkey'
        AND table_name = 'favorites'
    ) THEN
        ALTER TABLE "favorites" DROP CONSTRAINT "favorites_pkey";
    END IF;
END $$;--> statement-breakpoint
-- package_type의 NULL 값을 먼저 처리하고 NOT NULL 제약 추가
UPDATE "products" SET "package_type" = 'bulk' WHERE "package_type" IS NULL;
ALTER TABLE "products" ALTER COLUMN "package_type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_product_sku_id_pk" PRIMARY KEY("user_id","product_sku_id");--> statement-breakpoint
-- 새 컬럼을 nullable로 먼저 추가 (기존 데이터가 있을 경우를 대비)
ALTER TABLE "products" ADD COLUMN "line_id" uuid;--> statement-breakpoint
ALTER TABLE "nutrition_info" ADD COLUMN "line_flavor_id" uuid;--> statement-breakpoint
ALTER TABLE "nutrition_info" ADD COLUMN "serving_size" numeric(6, 2);--> statement-breakpoint
ALTER TABLE "line_flavor_protein_types" ADD CONSTRAINT "line_flavor_protein_types_line_flavor_id_line_flavors_id_fk" FOREIGN KEY ("line_flavor_id") REFERENCES "public"."line_flavors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "line_flavor_protein_types" ADD CONSTRAINT "line_flavor_protein_types_protein_type_id_protein_types_id_fk" FOREIGN KEY ("protein_type_id") REFERENCES "public"."protein_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "line_flavors" ADD CONSTRAINT "line_flavors_line_id_product_lines_id_fk" FOREIGN KEY ("line_id") REFERENCES "public"."product_lines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_flavors" ADD CONSTRAINT "product_flavors_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_flavors" ADD CONSTRAINT "product_flavors_line_flavor_id_line_flavors_id_fk" FOREIGN KEY ("line_flavor_id") REFERENCES "public"."line_flavors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_lines" ADD CONSTRAINT "product_lines_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_skus" ADD CONSTRAINT "product_skus_product_flavor_id_product_flavors_id_fk" FOREIGN KEY ("product_flavor_id") REFERENCES "public"."product_flavors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_line_flavor_protein_types_flavor" ON "line_flavor_protein_types" USING btree ("line_flavor_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_line_flavor_protein_types_protein" ON "line_flavor_protein_types" USING btree ("protein_type_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "unique_line_flavor_protein" ON "line_flavor_protein_types" USING btree ("line_flavor_id","protein_type_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_line_flavors_line" ON "line_flavors" USING btree ("line_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_line_flavors_flavor" ON "line_flavors" USING btree ("flavor_category");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "unique_line_flavor" ON "line_flavors" USING btree ("line_id","flavor_name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_product_flavors_product" ON "product_flavors" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_product_flavors_line_flavor" ON "product_flavors" USING btree ("line_flavor_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "unique_product_flavor" ON "product_flavors" USING btree ("product_id","line_flavor_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_product_lines_brand" ON "product_lines" USING btree ("brand_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_product_lines_name" ON "product_lines" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_skus_product_flavor" ON "product_skus" USING btree ("product_flavor_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_skus_barcode" ON "product_skus" USING btree ("barcode");--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_product_sku_id_product_skus_id_fk" FOREIGN KEY ("product_sku_id") REFERENCES "public"."product_skus"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_line_id_product_lines_id_fk" FOREIGN KEY ("line_id") REFERENCES "public"."product_lines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nutrition_info" ADD CONSTRAINT "nutrition_info_line_flavor_id_line_flavors_id_fk" FOREIGN KEY ("line_flavor_id") REFERENCES "public"."line_flavors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_favorites_product_sku" ON "favorites" USING btree ("product_sku_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_products_line" ON "products" USING btree ("line_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_products_package_type" ON "products" USING btree ("package_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "unique_line_package" ON "products" USING btree ("line_id","package_type");--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "brand_id";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "description";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "form";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "total_amount";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "servings_per_container";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "serving_size";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "is_active";--> statement-breakpoint
ALTER TABLE "nutrition_info" DROP COLUMN "variant_id";--> statement-breakpoint
ALTER TABLE "nutrition_info" ADD CONSTRAINT "nutrition_info_line_flavor_id_unique" UNIQUE("line_flavor_id");--> statement-breakpoint

-- 데이터 마이그레이션이 완료된 후 NOT NULL 제약 추가 (필요시 주석 처리)
-- ALTER TABLE "products" ALTER COLUMN "line_id" SET NOT NULL;
-- ALTER TABLE "nutrition_info" ALTER COLUMN "line_flavor_id" SET NOT NULL;