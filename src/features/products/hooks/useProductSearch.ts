import { FilterState, searchProducts } from "@/features/products/queries";
import { useQuery } from "@tanstack/react-query";
import { DEFAULT_SORT_BY, DEFAULT_SORT_ORDER, QUERY_STALE_TIME, QUERY_GC_TIME } from "@/features/products/constants";

interface UseProductSearchOptions {
  filters: FilterState;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
  enabled?: boolean;
}

export function useProductSearch({
  filters,
  sortBy = DEFAULT_SORT_BY,
  sortOrder = DEFAULT_SORT_ORDER,
  limit = 100,
  offset = 0,
  enabled = true,
}: UseProductSearchOptions) {
  return useQuery({
    queryKey: ["products", "search", filters, sortBy, sortOrder, limit, offset],
    queryFn: () => searchProducts(filters, sortBy, sortOrder, limit, offset),
    enabled,
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_GC_TIME,
    refetchOnMount: false, // 컴포넌트 마운트 시 refetch 비활성화
    refetchOnWindowFocus: false, // 윈도우 포커스 시 refetch 비활성화
  });
}