import { getArticles, getFeaturedArticle } from "@/features/articles/queries";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import ArticlesContent from "./ArticlesContent";

interface ArticlesPageProps {
  searchParams: Promise<{ category?: string }>;
}

async function ArticlesData({ category }: { category?: "guide" | "brand" | "exercise" | "diet" | "trend" }) {
  // 서버용 Supabase 클라이언트 생성
  const supabase = await createServerSupabaseClient();

  // 데이터 가져오기
  const [featuredArticle, articles] = await Promise.all([
    getFeaturedArticle(supabase),
    category
      ? getArticles("publishedAt", "desc", 100, 0, { category }, supabase)
      : getArticles("publishedAt", "desc", 100, 0, undefined, supabase),
  ]);

  // Featured 글을 제외한 나머지 글들
  const filteredArticles = articles.filter(
    (article) => featuredArticle && article.id !== featuredArticle.id,
  );

  return (
    <ArticlesContent
      featuredArticle={featuredArticle}
      filteredArticles={filteredArticles}
      category={category}
    />
  );
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const params = await searchParams;
  const category = params.category as "guide" | "brand" | "exercise" | "diet" | "trend" | undefined;

  return (
    <div className="mx-auto max-w-5xl xl:max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* 컨텐츠 영역 - Suspense로 감싸기 */}
      <Suspense
        fallback={
          <ArticlesContent
            featuredArticle={null}
            filteredArticles={[]}
            category={category}
            isLoading={true}
          />
        }
      >
        <ArticlesData category={category} />
      </Suspense>
    </div>
  );
}
