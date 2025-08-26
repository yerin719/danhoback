"use client";

import { Badge } from "@/components/ui/badge";
import type { ArticleCategory } from "@/lib/articles";

interface CategoryBadgeProps {
  category: ArticleCategory;
  variant?: "default" | "secondary" | "outline";
}

const categoryColors = {
  "가이드": "bg-blue-100 text-blue-800 hover:bg-blue-200",
  "제품 브랜드": "bg-purple-100 text-purple-800 hover:bg-purple-200", 
  "운동": "bg-green-100 text-green-800 hover:bg-green-200",
  "식단": "bg-orange-100 text-orange-800 hover:bg-orange-200",
  "트렌드": "bg-pink-100 text-pink-800 hover:bg-pink-200"
};

export default function CategoryBadge({ category, variant = "default" }: CategoryBadgeProps) {
  const colorClass = variant === "default" ? categoryColors[category] : "";
  
  return (
    <Badge 
      variant={variant === "default" ? "secondary" : variant}
      className={variant === "default" ? colorClass : ""}
    >
      {category}
    </Badge>
  );
}