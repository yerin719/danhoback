"use client";

import { Button } from "@/components/ui/button";
import { ARTICLE_CATEGORIES } from "@/features/articles/constants";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback } from "react";

function CategoryFilterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "all";

  const handleCategoryChange = useCallback(
    (category: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (category === "all") {
        params.delete("category");
      } else {
        params.set("category", category);
      }
      router.push(`/articles?${params.toString()}`);
    },
    [router, searchParams],
  );

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant={currentCategory === "all" ? "default" : "outline"}
        onClick={() => handleCategoryChange("all")}
        size="sm"
      >
        전체
      </Button>
      {Object.entries(ARTICLE_CATEGORIES).map(([key, label]) => (
        <Button
          key={key}
          variant={currentCategory === key ? "default" : "outline"}
          onClick={() => handleCategoryChange(key)}
          size="sm"
        >
          {label}
        </Button>
      ))}
    </div>
  );
}

export default function CategoryFilter() {
  return (
    <Suspense fallback={
      <div className="flex flex-wrap gap-3">
        <Button variant="default" size="sm">
          전체
        </Button>
        {Object.entries(ARTICLE_CATEGORIES).map(([key, label]) => (
          <Button key={key} variant="outline" size="sm">
            {label}
          </Button>
        ))}
      </div>
    }>
      <CategoryFilterContent />
    </Suspense>
  );
}