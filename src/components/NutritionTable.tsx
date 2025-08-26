"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

interface NutritionFacts {
  servingSize: number;
  calories: number;
  sodium?: number;
  carbs: number;
  sugar: number;
  protein: number;
  fat?: number;
  saturatedFat?: number;
  transFat?: number;
  cholesterol?: number;
  calcium?: number;
}

interface NutritionTableProps {
  nutritionFacts: NutritionFacts;
}

// 영양성분 기준치 대비 퍼센트 계산 (일일 권장량 기준)
const calculatePercentage = (value: number, nutrient: string): string => {
  const dailyValues: { [key: string]: number } = {
    sodium: 2000, // mg
    carbs: 324, // g
    sugar: 100, // g
    protein: 55, // g
    fat: 65, // g
    saturatedFat: 20, // g
    cholesterol: 300, // mg
    calcium: 800, // mg
  };

  if (!dailyValues[nutrient] || value === 0) return "-";

  const percentage = Math.round((value / dailyValues[nutrient]) * 100);
  return `${percentage}%`;
};

export default function NutritionTable({ nutritionFacts }: NutritionTableProps) {
  const nutritionRows = [
    {
      name: "열량",
      value: nutritionFacts.calories,
      unit: "kcal",
      percentage: "-",
      indent: false,
    },
    {
      name: "나트륨",
      value: nutritionFacts.sodium,
      unit: "mg",
      percentage: nutritionFacts.sodium
        ? calculatePercentage(nutritionFacts.sodium, "sodium")
        : "-",
      indent: false,
    },
    {
      name: "탄수화물",
      value: nutritionFacts.carbs,
      unit: "g",
      percentage: calculatePercentage(nutritionFacts.carbs, "carbs"),
      indent: false,
    },
    {
      name: "당류",
      value: nutritionFacts.sugar,
      unit: "g",
      percentage: calculatePercentage(nutritionFacts.sugar, "sugar"),
      indent: true,
    },
    {
      name: "단백질",
      value: nutritionFacts.protein,
      unit: "g",
      percentage: calculatePercentage(nutritionFacts.protein, "protein"),
      indent: false,
    },
    {
      name: "지방",
      value: nutritionFacts.fat,
      unit: "g",
      percentage: nutritionFacts.fat ? calculatePercentage(nutritionFacts.fat, "fat") : "-",
      indent: false,
    },
    {
      name: "포화지방",
      value: nutritionFacts.saturatedFat,
      unit: "g",
      percentage: nutritionFacts.saturatedFat
        ? calculatePercentage(nutritionFacts.saturatedFat, "saturatedFat")
        : "-",
      indent: true,
    },
    {
      name: "트랜스지방",
      value: nutritionFacts.transFat,
      unit: "g",
      percentage: "-",
      indent: true,
    },
    {
      name: "콜레스테롤",
      value: nutritionFacts.cholesterol,
      unit: "mg",
      percentage: nutritionFacts.cholesterol
        ? calculatePercentage(nutritionFacts.cholesterol, "cholesterol")
        : "-",
      indent: false,
    },
    {
      name: "칼슘",
      value: nutritionFacts.calcium,
      unit: "mg",
      percentage: nutritionFacts.calcium
        ? calculatePercentage(nutritionFacts.calcium, "calcium")
        : "-",
      indent: false,
    },
  ].filter((row) => row.value !== undefined);

  return (
    <div>
      <div className="space-y-4">
        {/* 영양성분 테이블 */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[140px] px-6">영양성분</TableHead>
                <TableHead className="text-center w-[120px] px-6">
                  1회 제공량 ({nutritionFacts.servingSize}g)
                </TableHead>
                <TableHead className="text-center w-[100px] px-6">%영양성분 기준치</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nutritionRows.map((row) => (
                <TableRow key={row.name}>
                  <TableCell className={`font-medium px-6 ${row.indent ? "pl-8" : ""}`}>
                    {row.indent && "- "}
                    {row.name}
                  </TableCell>
                  <TableCell className="text-center font-semibold px-6">
                    {row.value}
                    {row.unit}
                  </TableCell>
                  <TableCell className="text-center px-6">{row.percentage}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
