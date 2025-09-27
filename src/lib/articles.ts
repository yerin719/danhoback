// Article categories and related types

export const articleCategories = [
  "가이드",
  "제품 브랜드",
  "운동",
  "식단",
  "트렌드",
  "미분류",
] as const;

export type ArticleCategory = (typeof articleCategories)[number];

// Article related utilities and types can be added here
export interface Article {
  id: string;
  title: string;
  content: string;
  summary: string;
  featuredImage?: string;
  category: ArticleCategory;
  tags: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
}

export interface CreateArticleData {
  title: string;
  content: string;
  summary: string;
  featuredImage?: string;
  category: ArticleCategory;
  tags: string[];
  isPublic: boolean;
}
