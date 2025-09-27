"use client";

import { Card, CardContent } from "@/components/ui/card";
import { getCategoryDisplayName, type ArticleCategory } from "@/features/articles/constants";
import Link from "next/link";
import ArticleImage from "./ArticleImage";

interface ArticleCardProps {
  article: {
    id: string;
    slug: string;
    title: string;
    summary: string | null;
    category: string;
    featured_image: string | null;
  };
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/articles/${article.slug}`}>
      <Card className="h-full cursor-pointer border-none shadow-none p-0">
        <div className="aspect-video relative mb-4 overflow-hidden rounded-lg">
          <ArticleImage
            src={article.featured_image || ""}
            alt={article.title}
            category={getCategoryDisplayName(article.category as ArticleCategory)}
            iconSize="lg"
            className="object-cover"
          />
        </div>

        <CardContent className="pt-0 p-0">
          <div className="space-y-3">
            {/* 제목 */}
            <h3 className="font-semibold text-lg leading-tight line-clamp-2 hover:text-primary transition-colors">
              {article.title}
            </h3>

            {/* 요약 */}
            <p className="text-muted-foreground text-sm line-clamp-3 mb-2">
              {article.summary || ""}
            </p>

            {/* 카테고리 */}
            <div className="text-xs text-muted-foreground">
              {getCategoryDisplayName(article.category as ArticleCategory)}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
