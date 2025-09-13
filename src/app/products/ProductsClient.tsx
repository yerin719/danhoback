"use client";

import ProductCard from "@/components/ProductCard";
import { CarouselAdBanner } from "@/components/advertising";
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
import { productPageBannerCampaigns } from "@/features/products/data/bannerCampaigns";
import { useInfiniteProductSearch } from "@/features/products/hooks/useInfiniteProductSearch";
import { PRODUCTS_PER_PAGE } from "@/features/products/constants";
import { type FilterState } from "@/features/products/queries";
import { filtersToSearchParams } from "@/features/products/utils/urlParams";
import { ArrowUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface ProductsClientProps {
  initialFilters: FilterState;
  initialSortBy: string;
  initialSortOrder: "asc" | "desc";
}

export default function ProductsClient({
  initialFilters,
  initialSortBy,
  initialSortOrder,
}: ProductsClientProps) {
  const router = useRouter();

  // 현재 필터와 정렬 상태
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(initialSortOrder);

  // URL 파라미터 변경 시 상태 업데이트
  useEffect(() => {
    setFilters(initialFilters);
    setSortBy(initialSortBy);
    setSortOrder(initialSortOrder);
  }, [initialFilters, initialSortBy, initialSortOrder]);

  // React Query 무한스크롤로 데이터 가져오기
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteProductSearch({
    filters,
    sortBy,
    sortOrder,
    limit: PRODUCTS_PER_PAGE,
  });

  // 모든 페이지의 제품을 flat하게 만들기
  const products = data?.pages.flatMap((page) => page) ?? [];

  // URL 파라미터 업데이트 함수
  const updateUrl = useCallback(
    (newFilters: FilterState, newSortBy: string, newSortOrder: "asc" | "desc") => {
      const params = filtersToSearchParams(newFilters, newSortBy, newSortOrder);

      // URL 업데이트 (페이지 리로드 없이)
      router.push(`/products${params.toString() ? `?${params.toString()}` : ""}`);
    },
    [router],
  );

  // 필터 변경 핸들러
  const handleFilterChange = useCallback(
    (newFilters: FilterState) => {
      setFilters(newFilters);
      updateUrl(newFilters, sortBy, sortOrder);
    },
    [sortBy, sortOrder, updateUrl],
  );

  // 정렬 변경 핸들러
  const handleSortChange = useCallback(
    (newSortBy: string) => {
      if (newSortBy === sortBy) {
        // 같은 정렬 기준 클릭 시 순서 반전
        const newOrder = sortOrder === "asc" ? "desc" : "asc";
        setSortOrder(newOrder);
        updateUrl(filters, sortBy, newOrder);
      } else {
        // 새로운 정렬 기준
        setSortBy(newSortBy);
        setSortOrder("desc");
        updateUrl(filters, newSortBy, "desc");
      }
    },
    [filters, sortBy, sortOrder, updateUrl],
  );

  // 정렬 순서 토글
  const handleOrderToggle = useCallback(() => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
    updateUrl(filters, sortBy, newOrder);
  }, [filters, sortBy, sortOrder, updateUrl]);

  // 필터 초기화
  const handleResetFilters = useCallback(() => {
    router.push("/products");
  }, [router]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* 캐러셀 광고 배너 */}
      <CarouselAdBanner
        campaigns={[...productPageBannerCampaigns]}
        height={300}
        autoPlay={true}
        interval={5000}
        className="mb-6"
      />

      {/* 필터 컴포넌트 */}
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
          <Button variant="outline" size="sm" onClick={handleOrderToggle} className="px-3">
            <ArrowUpDown className="h-4 w-4" />
            {sortOrder === "asc" ? "오름차순" : "내림차순"}
          </Button>
        </div>
      </div>

      {/* 초기 로딩 상태 */}
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
      {!isLoading && !isError && products && products.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {products.map((product) => (
              <ProductCard key={product.variant_id} product={product} />
            ))}
          </div>

          {/* 무한스크롤 트리거 */}
          <div
            className="h-10 mt-8 flex items-center justify-center"
            ref={(el) => {
              if (el && hasNextPage && !isFetchingNextPage) {
                const observer = new IntersectionObserver(
                  (entries) => {
                    if (entries[0].isIntersecting) {
                      fetchNextPage();
                    }
                  },
                  { threshold: 0.1 }
                );
                observer.observe(el);
                return () => observer.disconnect();
              }
            }}
          >
            {isFetchingNextPage && (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span className="text-sm text-muted-foreground">더 많은 제품 불러오는 중...</span>
              </div>
            )}
            {!hasNextPage && products.length > 0 && (
              <span className="text-sm text-muted-foreground">모든 제품을 불러왔습니다</span>
            )}
          </div>
        </>
      )}

      {/* 검색 결과 없음 */}
      {!isLoading && !isError && products && products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">조건에 맞는 제품이 없습니다.</p>
          <button
            onClick={handleResetFilters}
            className="mt-4 text-sm text-blue-600 hover:text-blue-800"
          >
            필터 초기화
          </button>
        </div>
      )}
    </div>
  );
}
