// Article categories and related types

export const articleCategories = [
  "단백질 가이드",
  "운동 팁",
  "다이어트",
  "건강 정보",
  "제품 리뷰",
  "영양 정보",
  "트레이닝",
  "라이프스타일",
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
