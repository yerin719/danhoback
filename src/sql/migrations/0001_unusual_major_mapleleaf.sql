CREATE TYPE "public"."article_category" AS ENUM('guide', 'brand', 'exercise', 'diet', 'trend');--> statement-breakpoint
CREATE TYPE "public"."article_status" AS ENUM('draft', 'review', 'published', 'archived');--> statement-breakpoint
CREATE TABLE "article_tag_relations" (
	"article_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	CONSTRAINT "article_tag_relations_article_id_tag_id_pk" PRIMARY KEY("article_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "article_tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	"usage_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "article_tags_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "articles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(200),
	"title" varchar(300) NOT NULL,
	"summary" text,
	"content" text NOT NULL,
	"category" "article_category" NOT NULL,
	"featured_image" text,
	"author_id" uuid,
	"author_name" varchar(100),
	"status" "article_status" DEFAULT 'draft',
	"published_at" timestamp,
	"read_time" integer,
	"view_count" integer DEFAULT 0,
	"is_featured" boolean DEFAULT false,
	"meta_description" text,
	"meta_keywords" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "articles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "article_tag_relations" ADD CONSTRAINT "article_tag_relations_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_tag_relations" ADD CONSTRAINT "article_tag_relations_tag_id_article_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."article_tags"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_tag_relations_article" ON "article_tag_relations" USING btree ("article_id");--> statement-breakpoint
CREATE INDEX "idx_tag_relations_tag" ON "article_tag_relations" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "idx_article_tags_name" ON "article_tags" USING btree ("name");--> statement-breakpoint
CREATE INDEX "idx_articles_slug" ON "articles" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_articles_category" ON "articles" USING btree ("category");--> statement-breakpoint
CREATE INDEX "idx_articles_status" ON "articles" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_articles_published" ON "articles" USING btree ("published_at");--> statement-breakpoint
CREATE INDEX "idx_articles_featured" ON "articles" USING btree ("is_featured");