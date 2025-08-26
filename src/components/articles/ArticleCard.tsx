"use client";

import { Card, CardContent } from "@/components/ui/card";
import ProductImage from "@/components/ProductImage";
import type { Article } from "@/lib/articles";
import Link from "next/link";

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/articles/${article.id}`}>
      <Card className="h-full cursor-pointer border-none shadow-none hover:shadow-md transition-shadow duration-200">
        <div className="aspect-video relative mb-4 overflow-hidden rounded-lg">
          <ProductImage
            src={article.featuredImage}
            alt={article.title}
            className="object-cover transition-transform duration-200 hover:scale-105"
          />
        </div>
        
        <CardContent className="p-4 pt-0">
          <div className="space-y-3">
            {/* 제목 */}
            <h3 className="font-semibold text-lg leading-tight line-clamp-2 hover:text-primary transition-colors">
              {article.title}
            </h3>
            
            {/* 요약 */}
            <p className="text-muted-foreground text-sm line-clamp-3 mb-2">
              {article.summary}
            </p>
            
            {/* 카테고리 */}
            <div className="text-xs text-muted-foreground">
              {article.category}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}