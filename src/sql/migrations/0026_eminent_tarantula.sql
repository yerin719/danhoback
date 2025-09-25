ALTER TABLE "product_skus" ADD COLUMN "slug" varchar(255);--> statement-breakpoint
ALTER TABLE "product_skus" ADD CONSTRAINT "product_skus_slug_unique" UNIQUE("slug");