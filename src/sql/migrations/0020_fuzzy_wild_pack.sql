CREATE TABLE "product_protein_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"protein_type_id" uuid NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"percentage" numeric(5, 2),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "protein_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "protein_type" NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "protein_types_type_unique" UNIQUE("type")
);
--> statement-breakpoint
DROP INDEX "idx_products_protein";--> statement-breakpoint
ALTER TABLE "product_protein_types" ADD CONSTRAINT "product_protein_types_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_protein_types" ADD CONSTRAINT "product_protein_types_protein_type_id_protein_types_id_fk" FOREIGN KEY ("protein_type_id") REFERENCES "public"."protein_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_product_protein_types_product" ON "product_protein_types" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "idx_product_protein_types_protein" ON "product_protein_types" USING btree ("protein_type_id");--> statement-breakpoint
CREATE INDEX "unique_product_protein" ON "product_protein_types" USING btree ("product_id","protein_type_id");--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "protein_type";