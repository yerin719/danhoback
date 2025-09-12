import { useQuery } from "@tanstack/react-query";
import { getAllFilterOptions } from "@/features/products/queries";

// 모든 필터 옵션을 한 번에 가져오는 훅 (최적화된 버전)
export function useAllFilterOptions() {
  return useQuery({
    queryKey: ["filters", "all"],
    queryFn: () => getAllFilterOptions(),
    staleTime: 30 * 60 * 1000, // 30분
    gcTime: 60 * 60 * 1000, // 1시간
    refetchOnMount: false, // 마운트 시 refetch 비활성화
    refetchOnWindowFocus: false, // 윈도우 포커스 시 refetch 비활성화
  });
}