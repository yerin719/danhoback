ALTER TABLE "products" ADD COLUMN "size" varchar(50);--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "servings_per_container" integer;--> statement-breakpoint
ALTER TABLE "product_skus" DROP COLUMN "size";--> statement-breakpoint
ALTER TABLE "product_skus" DROP COLUMN "servings_per_container";