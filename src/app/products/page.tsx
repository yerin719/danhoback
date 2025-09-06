"use client";

import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import CompactProductFilters from "@/features/products/components/CompactProductFilters";
import { useProductSearch } from "@/features/products/hooks/useProductSearch";
import { getDefaultFilters, type FilterState } from "@/features/products/queries";
import { ArrowUpDown } from "lucide-react";
import { useState } from "react";

export default function ProductsPage() {
  const [filters, setFilters] = useState<FilterState>(getDefaultFilters());
  const [sortBy, setSortBy] = useState("favorites_count");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // 제품 검색 - 실제 DB에서 데이터 페칭
  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useProductSearch({
    filters,
    sortBy,
    sortOrder,
  });

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSortBy: string) => {
    if (newSortBy === sortBy) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(newSortBy);
      setSortOrder("desc");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* 필터 컴포넌트 - 실제 DB 필터 옵션 전달 */}
      <CompactProductFilters filters={filters} onFiltersChange={handleFilterChange} />

      {/* 정렬 옵션 */}
      <div className="mb-6 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {products && products.length > 0 && <span>{products.length}개의 제품</span>}
        </div>
        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="favorites_count">인기순</SelectItem>
              <SelectItem value="protein">단백질 함량순</SelectItem>
              <SelectItem value="calories">칼로리순</SelectItem>
              <SelectItem value="name">이름순</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
            className="px-3"
          >
            <ArrowUpDown className="h-4 w-4" />
            {sortOrder === "asc" ? "오름차순" : "내림차순"}
          </Button>
        </div>
      </div>

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 에러 상태 */}
      {isError && (
        <div className="text-center py-12">
          <p className="text-red-600">제품을 불러오는 중 오류가 발생했습니다.</p>
          <p className="text-sm text-muted-foreground mt-2">
            {error instanceof Error ? error.message : "알 수 없는 오류"}
          </p>
        </div>
      )}

      {/* 제품 목록 */}
      {!isLoading && !isError && products && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {products.map((product) => (
            <ProductCard key={product.variant_id} product={product} />
          ))}
        </div>
      )}

      {/* 검색 결과 없음 */}
      {!isLoading && !isError && products && products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">조건에 맞는 제품이 없습니다.</p>
          <button
            onClick={() => setFilters(getDefaultFilters())}
            className="mt-4 text-sm text-blue-600 hover:text-blue-800"
          >
            필터 초기화
          </button>
        </div>
      )}
    </div>
  );
}
