import ArticleContent from "@/components/articles/ArticleContent";
import ArticleImage from "@/components/articles/ArticleImage";
import RelatedArticles from "@/components/articles/RelatedArticles";
import { Button } from "@/components/ui/button";
import { getCategoryDisplayName } from "@/features/articles/constants";
import {
  getArticleById,
  getLatestArticles,
  getRelatedArticles,
  incrementViewCount,
} from "@/features/articles/queries";
import { ArrowLeft, Tag } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ArticleDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { id } = await params;

  // 상세 정보 가져오기 (태그 포함)
  const article = await getArticleById(id);

  if (!article) {
    notFound();
  }

  // 관련 글과 최신글 가져오기
  const [relatedArticlesData, latestArticlesData] = await Promise.all([
    getRelatedArticles(
      article.id,
      article.category as "guide" | "brand" | "exercise" | "diet" | "trend",
      3,
    ),
    getLatestArticles(5),
  ]);

  // 조회수 증가 (비동기로 처리, 결과 대기 안 함)
  incrementViewCount(article.id).catch(console.error);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* 뒤로 가기 버튼 */}
      <div className="mb-8">
        <Button asChild variant="ghost" size="sm">
          <Link href="/articles" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />글 목록으로
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        {/* 메인 콘텐츠 */}
        <div className="xl:col-span-2">
          <article>
            {/* 헤더 */}
            <header className="mb-12">
              {/* 대표 이미지 */}
              <div className="aspect-video relative mb-8 overflow-hidden rounded-lg">
                <ArticleImage
                  src={article.featured_image || ""}
                  alt={article.title}
                  category={getCategoryDisplayName(article.category)}
                  iconSize="xl"
                  className="object-cover"
                />
              </div>

              <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-6">{article.title}</h1>

              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {article.summary || ""}
              </p>

              {/* 메타 정보 */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <span>{article.author_name || "작성자"}</span>
                <span>•</span>
                <span>
                  {article.published_at
                    ? new Date(article.published_at).toLocaleDateString("ko-KR")
                    : new Date().toLocaleDateString("ko-KR")}
                </span>
                <span>•</span>
                <span>{article.read_time || 5}분 읽기</span>
                <span>•</span>
                <span>조회 {article.view_count || 0}</span>
              </div>

              {/* 단순 공백 */}
              <div className="border-b"></div>

              {/* 태그 */}
              {article.tags && article.tags.length > 0 && (
                <div className="flex items-center gap-2 mt-4">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="bg-muted px-2 py-1 rounded text-xs text-muted-foreground"
                      >
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </header>

            {/* 콘텐츠 */}
            <div className="mb-16">
              <ArticleContent content={article.content || ""} />
            </div>
          </article>
        </div>

        {/* 사이드바 - 데스크탑에서만 표시 */}
        <div className="hidden xl:block">
          <div className="sticky top-28">
            <RelatedArticles articles={relatedArticlesData} latestArticles={latestArticlesData} />
          </div>
        </div>
      </div>

      {/* 관련 글 - 모바일에서만 표시 */}
      <div className="xl:hidden">
        <RelatedArticles articles={relatedArticlesData} latestArticles={latestArticlesData} />
      </div>
    </div>
  );
}
