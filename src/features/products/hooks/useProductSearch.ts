import { FilterState, searchProducts } from "@/features/products/queries";
import { useQuery } from "@tanstack/react-query";

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
  sortBy = "favorites_count",
  sortOrder = "desc",
  limit = 100,
  offset = 0,
  enabled = true,
}: UseProductSearchOptions) {
  return useQuery({
    queryKey: ["products", "search", filters, sortBy, sortOrder, limit, offset],
    queryFn: () => searchProducts(filters, sortBy, sortOrder, limit, offset),
    enabled,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    refetchOnMount: false, // 컴포넌트 마운트 시 refetch 비활성화
    refetchOnWindowFocus: false, // 윈도우 포커스 시 refetch 비활성화
  });
}