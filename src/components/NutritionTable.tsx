"use client";

import { ProductNutrition } from "@/features/products/hooks/useProductDetail";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

interface NutritionTableProps {
  nutrition: ProductNutrition;
}

export default function NutritionTable({ nutrition }: NutritionTableProps) {
  const nutritionRows = [
    {
      name: "열량",
      value: nutrition.calories,
      unit: "kcal",
      indent: false,
    },
    {
      name: "나트륨",
      value: nutrition.sodium,
      unit: "mg",
      indent: false,
    },
    {
      name: "탄수화물",
      value: nutrition.carbs,
      unit: "g",
      indent: false,
    },
    {
      name: "당류",
      value: nutrition.sugar,
      unit: "g",
      indent: true,
    },
    {
      name: "식이섬유",
      value: nutrition.dietary_fiber,
      unit: "g",
      indent: true,
    },
    {
      name: "단백질",
      value: nutrition.protein,
      unit: "g",
      indent: false,
    },
    {
      name: "지방",
      value: nutrition.fat,
      unit: "g",
      indent: false,
    },
    {
      name: "포화지방",
      value: nutrition.saturated_fat,
      unit: "g",
      indent: true,
    },
    {
      name: "불포화지방",
      value: nutrition.unsaturated_fat,
      unit: "g",
      indent: true,
    },
    {
      name: "트랜스지방",
      value: nutrition.trans_fat,
      unit: "g",
      indent: true,
    },
    {
      name: "콜레스테롤",
      value: nutrition.cholesterol,
      unit: "mg",
      indent: false,
    },
    {
      name: "칼슘",
      value: nutrition.calcium,
      unit: "mg",
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
                <TableHead className="w-2/5 px-6 py-4 text-base bg-gray-50">영양성분</TableHead>
                <TableHead className="text-center w-3/5 px-6 py-4 text-base">
                  1회 제공량 {nutrition.serving_size && `(${nutrition.serving_size}g)`}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nutritionRows.map((row) => (
                <TableRow key={row.name} className="hover:bg-transparent">
                  <TableCell className={`font-medium px-6 py-4 text-base bg-gray-50 ${row.indent ? "pl-8" : ""}`}>
                    {row.indent && "- "}
                    {row.name}
                  </TableCell>
                  <TableCell className="text-center font-semibold px-6 py-4 text-base">
                    {row.value}
                    {row.unit}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
