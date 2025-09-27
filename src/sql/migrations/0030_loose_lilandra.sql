DROP INDEX "unique_line_package";--> statement-breakpoint
CREATE UNIQUE INDEX "unique_line_package_size_servings" ON "products" USING btree ("line_id","package_type","size","servings_per_container");