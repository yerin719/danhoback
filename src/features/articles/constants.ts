// ============================================
// ARTICLE CATEGORIES MAPPING
// ============================================

export const ARTICLE_CATEGORIES = {
  guide: "가이드",
  brand: "제품 브랜드",
  exercise: "운동",
  diet: "식단",
  trend: "트렌드",
} as const;

export type ArticleCategory = keyof typeof ARTICLE_CATEGORIES;

// ============================================
// ARTICLE STATUS MAPPING
// ============================================

export const ARTICLE_STATUS = {
  draft: "작성중",
  review: "검토중",
  published: "게시됨",
  archived: "보관됨",
} as const;

export type ArticleStatus = keyof typeof ARTICLE_STATUS;

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getCategoryDisplayName(category: ArticleCategory | null | undefined) {
  if (!category) return "미분류";
  return ARTICLE_CATEGORIES[category] || category;
}

export function getStatusDisplayName(status: ArticleStatus | null | undefined): string {
  if (!status) return "작성중";
  return ARTICLE_STATUS[status] || status;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function generateArticleSlug(title: string, articleId?: string): string {
  // 한글을 영문으로 변환하는 간단한 매핑
  const koreanToEnglish: Record<string, string> = {
    가이드: "guide",
    단백질: "protein",
    보충제: "supplement",
    운동: "exercise",
    식단: "diet",
    다이어트: "diet",
    트렌드: "trend",
    리뷰: "review",
    비교: "compare",
    브랜드: "brand",
  };

  let slug = title
    .toLowerCase()
    .replace(/\s+/g, "-") // 공백을 하이픈으로
    .replace(/[^\w가-힣\-]/g, ""); // 특수문자 제거

  // 한글 단어를 영문으로 치환
  Object.entries(koreanToEnglish).forEach(([korean, english]) => {
    slug = slug.replace(new RegExp(korean, "g"), english);
  });

  // 연속된 하이픈 제거
  slug = slug.replace(/-+/g, "-");

  // 앞뒤 하이픈 제거
  slug = slug.replace(/^-|-$/g, "");

  // ID가 있으면 끝에 추가 (고유성 보장)
  if (articleId) {
    slug += `-${articleId.slice(0, 6)}`;
  }

  return slug;
}

export function calculateReadTime(content: string): number {
  // 한국어 평균 읽기 속도: 분당 약 300자
  // 영어 평균 읽기 속도: 분당 약 250단어
  const koreanChars = (content.match(/[가-힣]/g) || []).length;
  const englishWords = (content.match(/[a-zA-Z]+/g) || []).length;

  const koreanReadTime = koreanChars / 300;
  const englishReadTime = englishWords / 250;

  const totalMinutes = Math.ceil(koreanReadTime + englishReadTime);
  return Math.max(1, totalMinutes); // 최소 1분
}

// ============================================
// VALIDATION HELPERS
// ============================================

export function isValidCategory(category: string): category is ArticleCategory {
  return Object.keys(ARTICLE_CATEGORIES).includes(category as ArticleCategory);
}

export function isValidStatus(status: string): status is ArticleStatus {
  return Object.keys(ARTICLE_STATUS).includes(status as ArticleStatus);
}

export function isPublished(status: ArticleStatus): boolean {
  return status === "published";
}

export function canBePublished(status: ArticleStatus): boolean {
  return status === "review";
}

// ============================================
// FILTERING HELPERS
// ============================================

export const ARTICLE_CATEGORIES_ARRAY = Object.keys(ARTICLE_CATEGORIES) as ArticleCategory[];
export const ARTICLE_STATUS_ARRAY = Object.keys(ARTICLE_STATUS) as ArticleStatus[];

export function getPublishableStatuses(): ArticleStatus[] {
  return ["review", "published"];
}

export function getDraftStatuses(): ArticleStatus[] {
  return ["draft", "review"];
}
