ALTER TABLE "product_protein_types" RENAME TO "variant_protein_types";--> statement-breakpoint
ALTER TABLE "variant_protein_types" RENAME COLUMN "product_id" TO "variant_id";--> statement-breakpoint
ALTER TABLE "variant_protein_types" DROP CONSTRAINT "product_protein_types_product_id_products_id_fk";
--> statement-breakpoint
ALTER TABLE "variant_protein_types" DROP CONSTRAINT "product_protein_types_protein_type_id_protein_types_id_fk";
--> statement-breakpoint
DROP INDEX "idx_product_protein_types_product";--> statement-breakpoint
DROP INDEX "idx_product_protein_types_protein";--> statement-breakpoint
DROP INDEX "unique_product_protein";--> statement-breakpoint
ALTER TABLE "variant_protein_types" ADD CONSTRAINT "variant_protein_types_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "variant_protein_types" ADD CONSTRAINT "variant_protein_types_protein_type_id_protein_types_id_fk" FOREIGN KEY ("protein_type_id") REFERENCES "public"."protein_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_variant_protein_types_variant" ON "variant_protein_types" USING btree ("variant_id");--> statement-breakpoint
CREATE INDEX "idx_variant_protein_types_protein" ON "variant_protein_types" USING btree ("protein_type_id");--> statement-breakpoint
CREATE INDEX "unique_variant_protein" ON "variant_protein_types" USING btree ("variant_id","protein_type_id");