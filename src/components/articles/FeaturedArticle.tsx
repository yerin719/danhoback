"use client";

import { Card } from "@/components/ui/card";
import ProductImage from "@/components/ProductImage";
import CategoryBadge from "./CategoryBadge";
import type { Article } from "@/lib/articles";
import Link from "next/link";
import { Clock, Eye, User } from "lucide-react";

interface FeaturedArticleProps {
  article: Article;
}

export default function FeaturedArticle({ article }: FeaturedArticleProps) {
  return (
    <Link href={`/articles/${article.id}`}>
      <Card className="cursor-pointer border-none shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* 왼쪽: 이미지 */}
          <div className="aspect-video lg:aspect-square relative">
            <ProductImage
              src={article.featuredImage}
              alt={article.title}
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
          
          {/* 오른쪽: 콘텐츠 */}
          <div className="p-8 flex flex-col justify-center">
            <div className="space-y-4">
              {/* 배지 */}
              <div className="flex items-center gap-2">
                <CategoryBadge category={article.category} />
                <span className="text-xs text-muted-foreground">최신글</span>
              </div>
              
              {/* 제목 */}
              <h2 className="text-2xl md:text-3xl font-bold leading-tight hover:text-primary transition-colors">
                {article.title}
              </h2>
              
              {/* 요약 */}
              <p className="text-muted-foreground leading-relaxed">
                {article.summary}
              </p>
              
              {/* 메타 정보 */}
              <div className="flex items-center gap-6 text-sm text-muted-foreground pt-4">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{article.readTime}분</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{article.views.toLocaleString()}</span>
                </div>
              </div>
              
              {/* 날짜 */}
              <div className="text-sm text-muted-foreground">
                {new Date(article.publishedAt).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}