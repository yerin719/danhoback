import client from "@/lib/supabase/client";
import { Database } from "../../../database.types";

// ============================================
// TYPE DEFINITIONS
// ============================================

// Article 타입 정의 (데이터베이스 기반)
export type Article = Database["public"]["Tables"]["articles"]["Row"];

// Article with tags 타입 (태그 관계 포함)
export type ArticleWithTags = Article & {
  tags: Array<{
    id: string;
    name: string;
  }>;
  tagRelations?: Array<{
    tag: {
      id: string;
      name: string;
    };
  }>;
};

// 필터 상태 인터페이스 (UI 컴포넌트용)
export interface ArticleFilters {
  category?: "guide" | "brand" | "exercise" | "diet" | "trend";
  status?: "draft" | "review" | "published" | "archived";
  searchQuery?: string;
}

// 정렬 옵션 타입
export type ArticleSortBy = "publishedAt" | "createdAt" | "viewCount" | "title";
export type SortOrder = "asc" | "desc";

// ============================================
// QUERY FUNCTIONS
// ============================================

/**
 * 전체 Articles 목록 조회
 * 정렬 파라미터 지원, 기본값: 최신순
 */
export async function getArticles(
  sortBy: ArticleSortBy = "publishedAt",
  sortOrder: SortOrder = "desc",
  limit: number = 100,
  offset: number = 0,
  filters?: ArticleFilters,
): Promise<Article[]> {
  try {
    let query = client
      .from("articles")
      .select("*")
      .eq("status", "published")
      .range(offset, offset + limit - 1);

    // 카테고리 필터링
    if (filters?.category) {
      query = query.eq("category", filters.category);
    }

    // 검색 쿼리 (제목과 요약에서 검색)
    if (filters?.searchQuery) {
      query = query.or(
        `title.ilike.%${filters.searchQuery}%,summary.ilike.%${filters.searchQuery}%`,
      );
    }

    // 정렬 적용
    const ascending = sortOrder === "asc";
    if (sortBy === "publishedAt") {
      query = query.order("published_at", { ascending, nullsFirst: false });
    } else if (sortBy === "viewCount") {
      query = query.order("view_count", { ascending, nullsFirst: false });
    } else if (sortBy === "title") {
      query = query.order("title", { ascending });
    } else {
      query = query.order("created_at", { ascending, nullsFirst: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching articles:", error);
      throw new Error("Failed to fetch articles");
    }

    return data || [];
  } catch (error) {
    console.error("Error in getArticles:", error);
    return [];
  }
}

/**
 * 카테고리별 Articles 조회
 */
export async function getArticlesByCategory(
  category: "guide" | "brand" | "exercise" | "diet" | "trend",
  sortBy: ArticleSortBy = "publishedAt",
  sortOrder: SortOrder = "desc",
  limit: number = 100,
  offset: number = 0,
): Promise<Article[]> {
  return getArticles(sortBy, sortOrder, limit, offset, { category });
}

/**
 * 단일 Article 상세 조회 (ID 또는 Slug 기준, 태그 포함)
 */
export async function getArticleById(id: string): Promise<ArticleWithTags | null> {
  try {
    const { data, error } = await client
      .from("articles")
      .select(`
        *,
        tagRelations:article_tag_relations(
          tag:article_tags(
            id,
            name
          )
        )
      `)
      .or(`id.eq.${id},slug.eq.${id}`)
      .eq("status", "published")
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // Not found
        return null;
      }
      console.error("Error fetching article:", error);
      return null;
    }

    // 태그 데이터 변환
    return {
      ...data,
      tags: data.tagRelations?.map(rel => rel.tag).filter(Boolean) || []
    };
  } catch (error) {
    console.error("Error in getArticleById:", error);
    return null;
  }
}

/**
 * 최신글 조회 (사이드바, 홈페이지 등에서 사용)
 */
export async function getLatestArticles(limit: number = 5): Promise<Article[]> {
  try {
    const { data, error } = await client
      .from("articles")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching latest articles:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getLatestArticles:", error);
    return [];
  }
}

/**
 * 관련 글 조회 (같은 카테고리, 현재 글 제외, 최신순)
 */
export async function getRelatedArticles(
  currentId: string,
  category: "guide" | "brand" | "exercise" | "diet" | "trend",
  limit: number = 3,
): Promise<Article[]> {
  try {
    const { data, error } = await client
      .from("articles")
      .select("*")
      .eq("status", "published")
      .eq("category", category)
      .neq("id", currentId)
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching related articles:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getRelatedArticles:", error);
    return [];
  }
}

/**
 * Articles 검색 (제목, 요약에서 검색)
 */
export async function searchArticles(
  query: string,
  sortBy: ArticleSortBy = "publishedAt",
  sortOrder: SortOrder = "desc",
  limit: number = 100,
  offset: number = 0,
  category?: "guide" | "brand" | "exercise" | "diet" | "trend",
): Promise<Article[]> {
  if (!query.trim()) {
    return getArticles(sortBy, sortOrder, limit, offset, { category });
  }

  return getArticles(sortBy, sortOrder, limit, offset, { searchQuery: query, category });
}

/**
 * Article 조회수 증가
 */
export async function incrementViewCount(articleId: string): Promise<boolean> {
  try {
    // 현재 조회수를 가져와서 1 증가
    const { data: currentData, error: fetchError } = await client
      .from("articles")
      .select("view_count")
      .eq("id", articleId)
      .eq("status", "published")
      .single();

    if (fetchError) {
      console.error("Error fetching current view count:", fetchError);
      return false;
    }

    const currentViewCount = currentData?.view_count || 0;

    const { error } = await client
      .from("articles")
      .update({
        view_count: currentViewCount + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", articleId)
      .eq("status", "published");

    if (error) {
      console.error("Error incrementing view count:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in incrementViewCount:", error);
    return false;
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Article 수 조회 (페이지네이션용)
 */
export async function getArticlesCount(filters?: ArticleFilters): Promise<number> {
  try {
    let query = client
      .from("articles")
      .select("*", { count: "exact", head: true })
      .eq("status", "published");

    // 카테고리 필터링
    if (filters?.category) {
      query = query.eq("category", filters.category);
    }

    // 검색 쿼리
    if (filters?.searchQuery) {
      query = query.or(
        `title.ilike.%${filters.searchQuery}%,summary.ilike.%${filters.searchQuery}%`,
      );
    }

    const { count, error } = await query;

    if (error) {
      console.error("Error counting articles:", error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error("Error in getArticlesCount:", error);
    return 0;
  }
}

/**
 * 카테고리별 Article 수 조회
 */
export async function getArticleCountByCategory(): Promise<Record<string, number>> {
  try {
    const { data, error } = await client
      .from("articles")
      .select("category")
      .eq("status", "published");

    if (error) {
      console.error("Error fetching category counts:", error);
      return {};
    }

    // 카테고리별 카운트 계산
    const counts: Record<string, number> = {};
    data?.forEach((article) => {
      const category = article.category;
      counts[category] = (counts[category] || 0) + 1;
    });

    return counts;
  } catch (error) {
    console.error("Error in getArticleCountByCategory:", error);
    return {};
  }
}

/**
 * Featured Article 조회 (is_featured가 true인 최신 글)
 */
export async function getFeaturedArticle(): Promise<Article | null> {
  try {
    const { data, error } = await client
      .from("articles")
      .select("*")
      .eq("status", "published")
      .eq("is_featured", true)
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // Featured article이 없으면 최신 글 반환
        const { data: latestData, error: latestError } = await client
          .from("articles")
          .select("*")
          .eq("status", "published")
          .order("published_at", { ascending: false, nullsFirst: false })
          .limit(1)
          .single();

        if (latestError) {
          console.error("Error fetching latest article as featured:", latestError);
          return null;
        }

        return latestData;
      }
      console.error("Error fetching featured article:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in getFeaturedArticle:", error);
    return null;
  }
}

/**
 * 기본 필터 상태 생성
 */
export function getDefaultArticleFilters(): ArticleFilters {
  return {
    searchQuery: "",
  };
}

/**
 * 필터 유효성 검증
 */
export function validateArticleFilters(filters: ArticleFilters): boolean {
  // 기본적인 유효성 검증
  if (filters.searchQuery && filters.searchQuery.length > 200) {
    return false;
  }

  return true;
}
