"use client";

import ArticleBanner from "@/components/articles/ArticleBanner";
import ArticleCard from "@/components/articles/ArticleCard";
import FeaturedArticle from "@/components/articles/FeaturedArticle";
import { Button } from "@/components/ui/button";
import {
  articleCategories,
  articles,
  getFeaturedArticle,
  type ArticleCategory,
} from "@/lib/articles";
import Link from "next/link";
import { useState } from "react";

export default function ArticlesPage() {
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory | "전체">("전체");
  const featuredArticle = getFeaturedArticle();

  const filteredArticles =
    selectedCategory === "전체"
      ? articles.filter((article) => article.id !== featuredArticle.id)
      : articles.filter(
          (article) => article.category === selectedCategory && article.id !== featuredArticle.id,
        );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* 배너 */}
      <div className="mb-12">
        <ArticleBanner />
      </div>

      {/* 최신글 하이라이트 */}
      <section className="mb-12">
        <FeaturedArticle article={featuredArticle} />
      </section>

      {/* 카테고리 필터 */}
      <section id="articles-list" className="mb-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex flex-wrap gap-3">
            <Button
              variant={selectedCategory === "전체" ? "default" : "outline"}
              onClick={() => setSelectedCategory("전체")}
              size="sm"
            >
              전체
            </Button>
            {articleCategories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>
          <Button asChild variant="default" size="sm">
            <Link href="/articles/new">글 작성</Link>
          </Button>
        </div>
      </section>

      {/* 게시글 리스트 */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">해당 카테고리의 글이 없습니다.</p>
          </div>
        )}
      </section>
    </div>
  );
}
