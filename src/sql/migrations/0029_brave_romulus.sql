DROP INDEX "unique_line_package";--> statement-breakpoint
CREATE UNIQUE INDEX "unique_line_package" ON "products" USING btree ("line_id","package_type");--> statement-breakpoint
ALTER TABLE "line_flavor_protein_types" DROP COLUMN "percentage";