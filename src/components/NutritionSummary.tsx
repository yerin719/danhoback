"use client";

interface NutritionSummaryProps {
  nutritionFacts: {
    protein: number;
    calories: number;
    carbs: number;
    sugar: number;
    fat?: number;
  };
}

export default function NutritionSummary({ nutritionFacts }: NutritionSummaryProps) {
  return (
    <div className="py-8 rounded-lg">
      <div className="flex justify-between text-center divide-x divide-primary-foreground/20">
        <div className="flex-1 space-y-1">
          <div className="text-2xl font-bold">{nutritionFacts.protein}g</div>
          <div className="text-base">단백질</div>
        </div>
        <div className="flex-1 space-y-1">
          <div className="text-2xl font-bold">{nutritionFacts.calories}</div>
          <div className="text-base">kcal</div>
        </div>
        <div className="flex-1 space-y-1">
          <div className="text-2xl font-bold">{nutritionFacts.carbs}g</div>
          <div className="text-base">탄수화물</div>
        </div>
        <div className="flex-1 space-y-1">
          <div className="text-2xl font-bold">{nutritionFacts.sugar}g</div>
          <div className="text-base">당</div>
        </div>
        <div className="flex-1 space-y-1">
          <div className="text-2xl font-bold">{nutritionFacts.fat || 1.5}g</div>
          <div className="text-base">지방</div>
        </div>
      </div>
    </div>
  );
}
