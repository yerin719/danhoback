"use client";

import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";
import { products, type Product } from "@/lib/products";
import { useMemo, useState } from "react";

interface FilterState {
  flavors: string[];
  proteinTypes: string[];
  proteinRange: [number, number];
  caloriesRange: [number, number];
  carbsRange: [number, number];
  sugarRange: [number, number];
  forms: string[];
  packageTypes: string[];
}

export default function ProductsPage() {
  const [filters, setFilters] = useState<FilterState>({
    flavors: [],
    proteinTypes: [],
    proteinRange: [15, 30],
    caloriesRange: [80, 200],
    carbsRange: [0, 15],
    sugarRange: [0, 10],
    forms: [],
    packageTypes: [],
  });

  const filteredProducts = useMemo(() => {
    return products.filter((product: Product) => {
      // 맛 필터 (다중 선택)
      if (filters.flavors.length > 0 && !filters.flavors.includes(product.flavor)) {
        return false;
      }

      // 단백질 종류 필터 (다중 선택)
      if (filters.proteinTypes.length > 0 && !filters.proteinTypes.includes(product.proteinType)) {
        return false;
      }

      // 단백질 함량 필터 (범위)
      if (
        product.nutritionFacts.protein < filters.proteinRange[0] ||
        product.nutritionFacts.protein > filters.proteinRange[1]
      ) {
        return false;
      }

      // 칼로리 필터 (범위)
      if (
        product.nutritionFacts.calories < filters.caloriesRange[0] ||
        product.nutritionFacts.calories > filters.caloriesRange[1]
      ) {
        return false;
      }

      // 탄수화물 필터 (범위)
      if (
        product.nutritionFacts.carbs < filters.carbsRange[0] ||
        product.nutritionFacts.carbs > filters.carbsRange[1]
      ) {
        return false;
      }

      // 당 함량 필터 (범위)
      if (
        product.nutritionFacts.sugar < filters.sugarRange[0] ||
        product.nutritionFacts.sugar > filters.sugarRange[1]
      ) {
        return false;
      }

      // 제품 형태 필터 (다중 선택)
      if (filters.forms.length > 0 && !filters.forms.includes(product.form || "powder")) {
        return false;
      }

      // 포장 타입 필터 (파우더 제품에만 적용)
      if (filters.packageTypes.length > 0 && (product.form === "powder" || !product.form)) {
        if (!filters.packageTypes.includes(product.packageType || "")) {
          return false;
        }
      }

      return true;
    });
  }, [filters]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <ProductFilters filters={filters} onFiltersChange={setFilters} />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">조건에 맞는 제품이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
