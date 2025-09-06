ALTER TABLE "product_variants" ALTER COLUMN "flavor_category" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."flavor_category";--> statement-breakpoint
CREATE TYPE "public"."flavor_category" AS ENUM('chocolate', 'strawberry', 'banana', 'matcha', 'grain', 'milktea', 'greentea', 'coffee', 'other');--> statement-breakpoint
ALTER TABLE "product_variants" ALTER COLUMN "flavor_category" SET DATA TYPE "public"."flavor_category" USING "flavor_category"::"public"."flavor_category";