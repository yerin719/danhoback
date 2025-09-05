import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// ============================================
// ENUMS
// ============================================

export const articleCategoryEnum = pgEnum("article_category", [
  "guide", // 가이드
  "brand", // 제품 브랜드
  "exercise", // 운동
  "diet", // 식단
  "trend", // 트렌드
]);

export const articleStatusEnum = pgEnum("article_status", [
  "draft", // 작성중
  "review", // 검토중
  "published", // 게시됨
  "archived", // 보관됨
]);

// ============================================
// TABLES
// ============================================

// Articles table
export const articles = pgTable(
  "articles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: varchar("slug", { length: 200 }).unique(),
    title: varchar("title", { length: 300 }).notNull(),
    summary: text("summary"),
    content: text("content").notNull(),
    category: articleCategoryEnum("category").notNull(),
    featuredImage: text("featured_image"),
    authorId: uuid("author_id"), // FK to users (nullable for now)
    authorName: varchar("author_name", { length: 100 }),
    status: articleStatusEnum("status").default("draft"),
    publishedAt: timestamp("published_at"),
    readTime: integer("read_time"),
    viewCount: integer("view_count").default(0),
    isFeatured: boolean("is_featured").default(false),
    metaDescription: text("meta_description"),
    metaKeywords: text("meta_keywords"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      slugIdx: index("idx_articles_slug").on(table.slug),
      categoryIdx: index("idx_articles_category").on(table.category),
      statusIdx: index("idx_articles_status").on(table.status),
      publishedIdx: index("idx_articles_published").on(table.publishedAt),
      featuredIdx: index("idx_articles_featured").on(table.isFeatured),
    };
  },
);

// Article tags table
export const articleTags = pgTable(
  "article_tags",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 50 }).unique().notNull(),
    usageCount: integer("usage_count").default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      nameIdx: index("idx_article_tags_name").on(table.name),
    };
  },
);

// Article tag relations table (many-to-many)
export const articleTagRelations = pgTable(
  "article_tag_relations",
  {
    articleId: uuid("article_id")
      .references(() => articles.id)
      .notNull(),
    tagId: uuid("tag_id")
      .references(() => articleTags.id)
      .notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.articleId, table.tagId] }),
      articleIdx: index("idx_tag_relations_article").on(table.articleId),
      tagIdx: index("idx_tag_relations_tag").on(table.tagId),
    };
  },
);

// ============================================
// RELATIONS
// ============================================

export const articlesRelations = relations(articles, ({ many }) => ({
  tagRelations: many(articleTagRelations),
}));

export const articleTagsRelations = relations(articleTags, ({ many }) => ({
  articleRelations: many(articleTagRelations),
}));

export const articleTagRelationsRelations = relations(articleTagRelations, ({ one }) => ({
  article: one(articles, {
    fields: [articleTagRelations.articleId],
    references: [articles.id],
  }),
  tag: one(articleTags, {
    fields: [articleTagRelations.tagId],
    references: [articleTags.id],
  }),
}));
