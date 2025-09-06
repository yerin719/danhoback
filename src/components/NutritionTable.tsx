"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { ProductNutrition } from "@/features/products/hooks/useProductDetail";

interface NutritionTableProps {
  nutrition: ProductNutrition;
  servingSize?: number;
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

export default function NutritionTable({ nutrition, servingSize = 30 }: NutritionTableProps) {
  const nutritionRows = [
    {
      name: "열량",
      value: nutrition.calories,
      unit: "kcal",
      percentage: "-",
      indent: false,
    },
    {
      name: "나트륨",
      value: nutrition.sodium,
      unit: "mg",
      percentage: nutrition.sodium
        ? calculatePercentage(nutrition.sodium, "sodium")
        : "-",
      indent: false,
    },
    {
      name: "탄수화물",
      value: nutrition.carbs,
      unit: "g",
      percentage: nutrition.carbs ? calculatePercentage(nutrition.carbs, "carbs") : "-",
      indent: false,
    },
    {
      name: "당류",
      value: nutrition.sugar,
      unit: "g",
      percentage: nutrition.sugar ? calculatePercentage(nutrition.sugar, "sugar") : "-",
      indent: true,
    },
    {
      name: "단백질",
      value: nutrition.protein,
      unit: "g",
      percentage: nutrition.protein ? calculatePercentage(nutrition.protein, "protein") : "-",
      indent: false,
    },
    {
      name: "지방",
      value: nutrition.fat,
      unit: "g",
      percentage: nutrition.fat ? calculatePercentage(nutrition.fat, "fat") : "-",
      indent: false,
    },
    {
      name: "포화지방",
      value: nutrition.saturated_fat,
      unit: "g",
      percentage: nutrition.saturated_fat
        ? calculatePercentage(nutrition.saturated_fat, "saturatedFat")
        : "-",
      indent: true,
    },
    {
      name: "콜레스테롤",
      value: nutrition.cholesterol,
      unit: "mg",
      percentage: nutrition.cholesterol
        ? calculatePercentage(nutrition.cholesterol, "cholesterol")
        : "-",
      indent: false,
    },
    {
      name: "칼슘",
      value: nutrition.calcium,
      unit: "mg",
      percentage: nutrition.calcium
        ? calculatePercentage(nutrition.calcium, "calcium")
        : "-",
      indent: false,
    },
  ].filter((row) => row.value !== undefined && row.value !== null);

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
                  1회 제공량 ({servingSize}g)
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
