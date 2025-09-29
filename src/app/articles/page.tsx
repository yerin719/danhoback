import ArticleCard from "@/components/articles/ArticleCard";
import ArticleWriteButton from "@/components/articles/ArticleWriteButton";
import CategoryFilter from "@/components/articles/CategoryFilter";
import FeaturedArticle from "@/components/articles/FeaturedArticle";
import { getCategoryDisplayName } from "@/features/articles/constants";
import { getArticles, getFeaturedArticle } from "@/features/articles/queries";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Suspense } from "react";

interface ArticlesPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const params = await searchParams;
  const category = params.category as "guide" | "brand" | "exercise" | "diet" | "trend" | undefined;

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
    <div className="mx-auto max-w-5xl xl:max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* 최신글 하이라이트 */}
      {featuredArticle && (
        <section className="mb-10">
          <FeaturedArticle article={featuredArticle} />
        </section>
      )}

      {/* 카테고리 필터 */}
      <section id="articles-list" className="mb-8">
        <div className="flex justify-between items-center mb-8">
          <Suspense fallback={<div className="flex gap-3">로딩 중...</div>}>
            <CategoryFilter />
          </Suspense>
          <ArticleWriteButton />
        </div>
      </section>

      {/* 게시글 리스트 */}
      <section>
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {category
                ? `${getCategoryDisplayName(category)} 카테고리의 글이 없습니다.`
                : "아직 작성된 글이 없습니다."}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
