ALTER TABLE "product_variants" ALTER COLUMN "flavor_category" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."flavor_category";--> statement-breakpoint
CREATE TYPE "public"."flavor_category" AS ENUM('grain', 'chocolate', 'strawberry', 'banana', 'milk', 'coffee', 'original', 'black_sesame', 'milktea', 'greentea', 'anilla', 'other');--> statement-breakpoint
ALTER TABLE "product_variants" ALTER COLUMN "flavor_category" SET DATA TYPE "public"."flavor_category" USING "flavor_category"::"public"."flavor_category";