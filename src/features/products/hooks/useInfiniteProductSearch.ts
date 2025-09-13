import { FilterState, searchProducts } from "@/features/products/queries";
import { useInfiniteQuery } from "@tanstack/react-query";
import { PRODUCTS_PER_PAGE, QUERY_STALE_TIME, QUERY_GC_TIME, DEFAULT_SORT_BY, DEFAULT_SORT_ORDER } from "@/features/products/constants";

interface UseInfiniteProductSearchOptions {
  filters: FilterState;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  limit?: number;
  enabled?: boolean;
}

export function useInfiniteProductSearch({
  filters,
  sortBy = DEFAULT_SORT_BY,
  sortOrder = DEFAULT_SORT_ORDER,
  limit = PRODUCTS_PER_PAGE,
  enabled = true,
}: UseInfiniteProductSearchOptions) {
  return useInfiniteQuery({
    queryKey: ["products", "infinite", filters, sortBy, sortOrder, limit],
    queryFn: ({ pageParam = 0 }) =>
      searchProducts(filters, sortBy, sortOrder, limit, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // 마지막 페이지에서 가져온 데이터가 limit보다 적으면 더 이상 페이지가 없음
      if (lastPage.length < limit) {
        return undefined;
      }
      // 다음 페이지의 offset 계산
      return allPages.length * limit;
    },
    enabled,
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_GC_TIME,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}