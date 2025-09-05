CREATE TYPE "public"."flavor_category" AS ENUM('chocolate', 'strawberry', 'vanilla', 'banana', 'matcha', 'grain', 'milktea', 'greentea', 'coffee', 'mint', 'cookies', 'other');--> statement-breakpoint
CREATE TYPE "public"."protein_type" AS ENUM('wpi', 'wpc', 'wph', 'wpih', 'casein', 'goat_milk', 'colostrum', 'isp', 'spc', 'pea', 'rice', 'oat', 'mpc', 'mpi', 'egg', 'mixed');--> statement-breakpoint
CREATE TABLE "brands" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"name_en" varchar(100),
	"logo_url" text,
	"website" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "brands_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "product_variants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"slug" varchar(200),
	"name" varchar(200) NOT NULL,
	"flavor_category" "flavor_category",
	"flavor_name" varchar(100),
	"size" varchar(50),
	"total_amount" numeric(8, 2),
	"servings_per_container" integer,
	"serving_size" numeric(6, 2),
	"barcode" varchar(20),
	"primary_image" text,
	"images" jsonb,
	"purchase_url" text,
	"favorites_count" integer DEFAULT 0,
	"is_available" boolean DEFAULT true,
	"display_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "product_variants_slug_unique" UNIQUE("slug"),
	CONSTRAINT "product_variants_barcode_unique" UNIQUE("barcode")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand_id" uuid NOT NULL,
	"name" varchar(200) NOT NULL,
	"protein_type" "protein_type" NOT NULL,
	"form" varchar(30) DEFAULT 'powder',
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "variant_nutrition" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"variant_id" uuid NOT NULL,
	"calories" numeric(6, 2),
	"protein" numeric(6, 2) NOT NULL,
	"carbs" numeric(6, 2),
	"sugar" numeric(6, 2),
	"fat" numeric(6, 2),
	"saturated_fat" numeric(6, 2),
	"sodium" numeric(8, 2),
	"cholesterol" numeric(6, 2),
	"calcium" numeric(8, 2),
	"bcaa" numeric(6, 2),
	"additional_nutrients" jsonb,
	"allergen_info" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "variant_nutrition_variant_id_unique" UNIQUE("variant_id")
);
--> statement-breakpoint
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "variant_nutrition" ADD CONSTRAINT "variant_nutrition_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_variants_product" ON "product_variants" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "idx_variants_flavor" ON "product_variants" USING btree ("flavor_category");--> statement-breakpoint
CREATE INDEX "idx_products_brand" ON "products" USING btree ("brand_id");--> statement-breakpoint
CREATE INDEX "idx_products_protein" ON "products" USING btree ("protein_type");