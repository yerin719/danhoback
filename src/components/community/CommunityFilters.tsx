"use client";

import {
  communityCategories,
  type CommunityCategory,
} from "@/lib/community";
import { cn } from "@/lib/utils";

interface CommunityFiltersProps {
  selectedCategory: CommunityCategory | null;
  onCategoryChange: (category: CommunityCategory | null) => void;
  onReset: () => void;
  onClearSearch: () => void;
}

export default function CommunityFilters({
  selectedCategory,
  onCategoryChange,
  onClearSearch,
}: CommunityFiltersProps) {
  const handleCategoryClick = (category: CommunityCategory) => {
    onCategoryChange(category);
    onClearSearch();
  };

  return (
    <div className="w-full lg:w-80 space-y-4">
      {/* 필터 메뉴 */}
      <div className="space-y-1">
        {/* 홈 */}
        <button
          onClick={() => {
            onCategoryChange(null);
            onClearSearch();
          }}
          className={cn(
            "w-full text-left px-3 py-2 text-sm rounded-md transition-colors",
            !selectedCategory
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted",
          )}
        >
          홈
        </button>

        {/* 카테고리별 메뉴 */}
        {communityCategories.map((category) => {
          const isSelected = selectedCategory === category;

          return (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={cn(
                "w-full text-left px-3 py-2 text-sm rounded-md transition-colors font-medium",
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted",
              )}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}
