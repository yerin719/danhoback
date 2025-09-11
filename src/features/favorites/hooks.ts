"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserFavorites, toggleFavorite } from "./queries";

// 사용자 찜 목록 조회 훅
export function useFavorites() {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: () => getUserFavorites(),
    staleTime: 1000 * 60 * 5, // 5분
  });
}

// 찜 토글 훅
export function useToggleFavorite(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productVariantId,
      currentStatus,
    }: {
      productVariantId: string;
      currentStatus: boolean;
    }) => toggleFavorite(productVariantId, userId, currentStatus),
    onSuccess: () => {
      // 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["products"] }); // 제품 목록도 무효화 (is_favorited 업데이트)
    },
  });
}
