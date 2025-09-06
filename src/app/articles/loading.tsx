import ArticleBanner from "@/components/articles/ArticleBanner";
import ArticleCardSkeleton from "@/components/articles/ArticleCardSkeleton";
import FeaturedArticleSkeleton from "@/components/articles/FeaturedArticleSkeleton";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function ArticlesLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* 배너 */}
      <div className="mb-12">
        <ArticleBanner />
      </div>

      {/* Featured 글 스켈레톤 */}
      <section className="mb-12">
        <FeaturedArticleSkeleton />
      </section>

      {/* 카테고리 필터 */}
      <section id="articles-list" className="mb-8">
        <div className="flex justify-between items-center mb-8">
          {/* 카테고리 버튼들 스켈레톤 */}
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-8 w-12" /> {/* 전체 */}
            <Skeleton className="h-8 w-16" /> {/* 가이드 */}
            <Skeleton className="h-8 w-20" /> {/* 제품 브랜드 */}
            <Skeleton className="h-8 w-12" /> {/* 운동 */}
            <Skeleton className="h-8 w-12" /> {/* 식단 */}
            <Skeleton className="h-8 w-16" /> {/* 트렌드 */}
          </div>
          <Button asChild variant="default" size="sm">
            <Link href="/articles/new">글 작성</Link>
          </Button>
        </div>
      </section>

      {/* 게시글 리스트 스켈레톤 */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 9 }).map((_, index) => (
            <ArticleCardSkeleton key={index} />
          ))}
        </div>
      </section>
    </div>
  );
}