ALTER TABLE "products" ADD COLUMN "package_type" "package_type";--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "size" varchar(50);--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "total_amount" numeric(8, 2);--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "servings_per_container" integer;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "serving_size" numeric(6, 2);--> statement-breakpoint
ALTER TABLE "product_variants" DROP COLUMN "package_type";--> statement-breakpoint
ALTER TABLE "product_variants" DROP COLUMN "size";--> statement-breakpoint
ALTER TABLE "product_variants" DROP COLUMN "total_amount";--> statement-breakpoint
ALTER TABLE "product_variants" DROP COLUMN "servings_per_container";--> statement-breakpoint
ALTER TABLE "product_variants" DROP COLUMN "serving_size";