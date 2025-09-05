CREATE TYPE "public"."package_type" AS ENUM('bulk', 'pouch', 'stick');--> statement-breakpoint
CREATE TYPE "public"."product_form" AS ENUM('powder', 'rtd');--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "form" SET DEFAULT 'powder'::"public"."product_form";--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "form" SET DATA TYPE "public"."product_form" USING "form"::"public"."product_form";--> statement-breakpoint
ALTER TABLE "product_variants" ADD COLUMN "package_type" "package_type";