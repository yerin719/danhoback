"use client";

import { Card, CardContent } from "@/components/ui/card";
import ProductImage from "@/components/ProductImage";
import CategoryBadge from "./CategoryBadge";
import type { Article } from "@/lib/articles";
import Link from "next/link";
import { Clock, Eye } from "lucide-react";

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
            {/* 카테고리 배지 */}
            <CategoryBadge category={article.category} />
            
            {/* 제목 */}
            <h3 className="font-semibold text-lg leading-tight line-clamp-2 hover:text-primary transition-colors">
              {article.title}
            </h3>
            
            {/* 요약 */}
            <p className="text-muted-foreground text-sm line-clamp-3">
              {article.summary}
            </p>
            
            {/* 메타 정보 */}
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{article.readTime}분</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{article.views.toLocaleString()}</span>
                </div>
              </div>
              <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}