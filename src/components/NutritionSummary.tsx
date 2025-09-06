"use client";

import { ProductNutrition } from "@/features/products/hooks/useProductDetail";

interface NutritionSummaryProps {
  nutrition: ProductNutrition;
}

export default function NutritionSummary({ nutrition }: NutritionSummaryProps) {
  return (
    <div className="py-8 rounded-lg">
      <div className="flex justify-between text-center divide-x divide-primary-foreground/20">
        <div className="flex-1 space-y-1">
          <div className="text-2xl font-bold">{nutrition.protein || 0}g</div>
          <div className="text-base">단백질</div>
        </div>
        <div className="flex-1 space-y-1">
          <div className="text-2xl font-bold">{nutrition.calories || 0}</div>
          <div className="text-base">kcal</div>
        </div>
        <div className="flex-1 space-y-1">
          <div className="text-2xl font-bold">{nutrition.carbs || 0}g</div>
          <div className="text-base">탄수화물</div>
        </div>
        <div className="flex-1 space-y-1">
          <div className="text-2xl font-bold">{nutrition.sugar || 0}g</div>
          <div className="text-base">당</div>
        </div>
        <div className="flex-1 space-y-1">
          <div className="text-2xl font-bold">{nutrition.fat || 0}g</div>
          <div className="text-base">지방</div>
        </div>
      </div>
    </div>
  );
}
