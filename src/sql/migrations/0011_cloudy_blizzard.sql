ALTER TABLE "product_variants" ALTER COLUMN "slug" SET NOT NULL;--> statement-breakpoint
CREATE INDEX "idx_variants_slug" ON "product_variants" USING btree ("slug");