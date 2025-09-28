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
      productSkuId,
      currentStatus,
    }: {
      productSkuId: string;
      currentStatus: boolean;
    }) => toggleFavorite(productSkuId, userId, currentStatus),
    // Optimistic Update
    onMutate: async ({ productSkuId, currentStatus }) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({
        predicate: (query) => {
          const key = query.queryKey[0];
          return key === "products" || key === "product";
        }
      });

      // 이전 데이터 백업
      const previousData = queryClient.getQueriesData({
        predicate: (query) => {
          const key = query.queryKey[0];
          return key === "products" || key === "product";
        }
      });

      // Optimistic update
      queryClient.setQueriesData(
        {
          predicate: (query) => {
            const key = query.queryKey[0];
            return key === "products" || key === "product";
          }
        },
        (oldData: any) => {
          if (!oldData) return oldData;

          // 무한스크롤 데이터 구조 처리
          if (oldData.pages) {
            return {
              ...oldData,
              pages: oldData.pages.map((page: any[]) =>
                page.map((product: any) =>
                  product.sku_id === productSkuId
                    ? {
                        ...product,
                        is_favorited: !currentStatus,
                        favorites_count: product.favorites_count + (!currentStatus ? 1 : -1)
                      }
                    : product
                )
              )
            };
          }

          // 단일 제품 상세 데이터 구조 처리
          if (oldData.selected_sku?.id === productSkuId) {
            return {
              ...oldData,
              is_favorited: !currentStatus
            };
          }

          // 일반 배열 구조 처리
          if (Array.isArray(oldData)) {
            return oldData.map((product: any) =>
              product.sku_id === productSkuId
                ? {
                    ...product,
                    is_favorited: !currentStatus,
                    favorites_count: product.favorites_count + (!currentStatus ? 1 : -1)
                  }
                : product
            );
          }

          return oldData;
        }
      );

      return { previousData };
    },
    onError: (err, variables, context) => {
      // 에러 시 이전 데이터로 롤백
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSuccess: () => {
      // 관련 쿼리 무효화 (서버 데이터와 동기화)
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({
        predicate: (query) => {
          const key = query.queryKey[0];
          return key === "products" || key === "product";
        }
      });
    },
  });
}
