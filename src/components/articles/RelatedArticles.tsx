"use client";

import type { Article } from "@/lib/articles";
import { getLatestArticles } from "@/lib/articles";
import Link from "next/link";
import ArticleCard from "./ArticleCard";
import ArticleImage from "./ArticleImage";

interface RelatedArticlesProps {
  articles: Article[];
}

export default function RelatedArticles({ articles }: RelatedArticlesProps) {
  const latestArticles = getLatestArticles(5);

  return (
    <section>
      {/* 관련 글 섹션 */}
      {articles.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-8">관련 글</h2>

          {/* 모바일: 세로 레이아웃 (기존 ArticleCard 사용) */}
          <div className="xl:hidden grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          {/* 데스크탑: 가로 레이아웃 */}
          <div className="hidden xl:block">
            {articles.map((article) => (
              <RelatedArticleHorizontalCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      )}

      {/* 최신글 섹션 */}
      <div>
        <h2 className="text-2xl font-bold mb-8">최신글</h2>

        {/* 모바일: 세로 레이아웃 */}
        <div className="xl:hidden grid grid-cols-1 md:grid-cols-2 gap-6">
          {latestArticles.map((article) => (
            <ArticleCard key={`latest-${article.id}`} article={article} />
          ))}
        </div>

        {/* 데스크탑: 가로 레이아웃 */}
        <div className="hidden xl:block">
          {latestArticles.map((article) => (
            <RelatedArticleHorizontalCard key={`latest-${article.id}`} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}

// 데스크탑용 가로형 카드 컴포넌트
function RelatedArticleHorizontalCard({ article }: { article: Article }) {
  return (
    <Link href={`/articles/${article.id}`}>
      <div className="flex gap-4 rounded-lg cursor-pointer mb-6">
        {/* 이미지 */}
        <div className="flex-shrink-0 w-20 h-16 relative overflow-hidden rounded-lg">
          <ArticleImage
            src={article.featuredImage}
            alt={article.title}
            category={article.category}
            iconSize="sm"
            className="object-cover transition-transform duration-200 hover:scale-105"
          />
        </div>

        {/* 콘텐츠 */}
        <div className="flex-1 space-y-2">
          <h3 className="font-semibold text-lg leading-tight line-clamp-2 hover:text-primary transition-colors">
            {article.title}
          </h3>
          <div className="text-xs text-muted-foreground">{article.category}</div>
        </div>
      </div>
    </Link>
  );
}
