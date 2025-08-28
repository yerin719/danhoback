"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { Article } from "@/lib/articles";
import Link from "next/link";
import ArticleImage from "./ArticleImage";

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/articles/${article.id}`}>
      <Card className="h-full cursor-pointer border-none shadow-none p-0">
        <div className="aspect-video relative mb-4 overflow-hidden rounded-lg">
          <ArticleImage
            src={article.featuredImage}
            alt={article.title}
            category={article.category}
            iconSize="lg"
            className="object-cover transition-transform duration-200 hover:scale-105"
          />
        </div>

        <CardContent className="pt-0 p-0">
          <div className="space-y-3">
            {/* 제목 */}
            <h3 className="font-semibold text-lg leading-tight line-clamp-2 hover:text-primary transition-colors">
              {article.title}
            </h3>

            {/* 요약 */}
            <p className="text-muted-foreground text-sm line-clamp-3 mb-2">{article.summary}</p>

            {/* 카테고리 */}
            <div className="text-xs text-muted-foreground">{article.category}</div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
