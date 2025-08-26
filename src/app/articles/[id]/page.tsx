"use client";

import ArticleContent from "@/components/articles/ArticleContent";
import CategoryBadge from "@/components/articles/CategoryBadge";
import RelatedArticles from "@/components/articles/RelatedArticles";
import { Button } from "@/components/ui/button";
import { articles, getRelatedArticles } from "@/lib/articles";
import { ArrowLeft, Clock, Eye, User, Calendar, Tag } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function ArticleDetailPage({ params }: { params: { id: string } }) {
  const article = articles.find((a) => a.id === params.id);

  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedArticles(article.id, article.category);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* 뒤로 가기 버튼 */}
      <div className="mb-8">
        <Button asChild variant="ghost" size="sm">
          <Link href="/articles" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            글 목록으로
          </Link>
        </Button>
      </div>

      <article>
        {/* 헤더 */}
        <header className="mb-12">
          <div className="mb-4">
            <CategoryBadge category={article.category} />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-6">
            {article.title}
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            {article.summary}
          </p>
          
          {/* 메타 정보 */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground pb-8 border-b">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time dateTime={article.publishedAt}>
                {new Date(article.publishedAt).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{article.readTime}분 읽기</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>{article.views.toLocaleString()} 보기</span>
            </div>
          </div>
          
          {/* 태그 */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex items-center gap-2 mt-4">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-muted px-2 py-1 rounded text-xs text-muted-foreground"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </header>

        {/* 콘텐츠 */}
        <div className="mb-16">
          <ArticleContent content={article.content} />
        </div>
      </article>

      {/* 관련 글 */}
      <RelatedArticles articles={relatedArticles} />
    </div>
  );
}