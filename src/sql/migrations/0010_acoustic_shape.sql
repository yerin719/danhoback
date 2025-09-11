CREATE TABLE "favorites" (
	"user_id" uuid NOT NULL,
	"product_variant_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "favorites_user_id_product_variant_id_pk" PRIMARY KEY("user_id","product_variant_id")
);
--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_product_variant_id_product_variants_id_fk" FOREIGN KEY ("product_variant_id") REFERENCES "public"."product_variants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_favorites_product_variant" ON "favorites" USING btree ("product_variant_id");--> statement-breakpoint
CREATE INDEX "idx_favorites_created" ON "favorites" USING btree ("created_at" DESC NULLS LAST);