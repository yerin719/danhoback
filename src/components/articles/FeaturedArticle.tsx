"use client";

import { Card } from "@/components/ui/card";
import { ArticleCategory, getCategoryDisplayName } from "@/features/articles/constants";
import Link from "next/link";
import ArticleImage from "./ArticleImage";

interface FeaturedArticleProps {
  article: {
    id: string;
    slug: string;
    title: string;
    summary: string | null;
    category: ArticleCategory;
    featured_image: string | null;
  };
}

export default function FeaturedArticle({ article }: FeaturedArticleProps) {
  return (
    <Link href={`/articles/${article.slug}`}>
      <Card className="cursor-pointer border-none shadow-none overflow-hidden p-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
          {/* 상단/왼쪽: 이미지 */}
          <div className="aspect-video relative overflow-hidden rounded-lg">
            <ArticleImage
              src={article.featured_image || ""}
              alt={article.title}
              category={getCategoryDisplayName(article.category)}
              iconSize="xl"
              className="object-cover"
            />
          </div>

          {/* 하단/오른쪽: 콘텐츠 */}
          <div className="sm:px-8 mt-6 sm:mt-0 flex flex-col justify-center">
            <div className="space-y-2">
              {/* 카테고리 */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {getCategoryDisplayName(article.category)}
                </span>
              </div>

              {/* 제목 */}
              <h2 className="text-2xl sm:text-3xl font-semibold leading-tight hover:text-primary transition-colors">
                {article.title}
              </h2>

              {/* 요약 */}
              <p className="text-muted-foreground leading-relaxed">{article.summary || ""}</p>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
