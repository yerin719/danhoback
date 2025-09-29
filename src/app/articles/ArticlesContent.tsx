"use client";

import ArticleCard from "@/components/articles/ArticleCard";
import ArticleCardSkeleton from "@/components/articles/ArticleCardSkeleton";
import ArticleWriteButton from "@/components/articles/ArticleWriteButton";
import CategoryFilter from "@/components/articles/CategoryFilter";
import FeaturedArticle from "@/components/articles/FeaturedArticle";
import FeaturedArticleSkeleton from "@/components/articles/FeaturedArticleSkeleton";
import { getCategoryDisplayName, type ArticleCategory } from "@/features/articles/constants";
import type { Article } from "@/features/articles/queries";
import { Skeleton } from "@/components/ui/skeleton";

interface ArticlesContentProps {
  featuredArticle: Article | null;
  filteredArticles: Article[];
  category?: "guide" | "brand" | "exercise" | "diet" | "trend";
  isLoading?: boolean;
}

export default function ArticlesContent({
  featuredArticle,
  filteredArticles,
  category,
  isLoading = false
}: ArticlesContentProps) {
  if (isLoading) {
    return (
      <>
        {/* Featured 글 스켈레톤 */}
        <section className="mb-10">
          <FeaturedArticleSkeleton />
        </section>

        {/* 카테고리 필터 스켈레톤 */}
        <section id="articles-list" className="mb-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex flex-wrap gap-3">
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-8 w-16" />
            </div>
            <ArticleWriteButton />
          </div>
        </section>

        {/* 게시글 리스트 스켈레톤 */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 9 }).map((_, index) => (
              <ArticleCardSkeleton key={index} />
            ))}
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      {/* 최신글 하이라이트 */}
      {featuredArticle && (
        <section className="mb-10">
          <FeaturedArticle article={{
            id: featuredArticle.id,
            slug: featuredArticle.slug,
            title: featuredArticle.title,
            summary: featuredArticle.summary,
            category: featuredArticle.category as ArticleCategory,
            featured_image: featuredArticle.featured_image
          }} />
        </section>
      )}

      {/* 카테고리 필터 */}
      <section id="articles-list" className="mb-8">
        <div className="flex justify-between items-center mb-8">
          <CategoryFilter />
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
    </>
  );
}