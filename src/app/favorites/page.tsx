"use client";

import EmptyFavorites from "@/components/EmptyFavorites";
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/features/favorites/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function FavoritesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { data: favorites, isLoading, refetch } = useFavorites();

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login?redirectedFrom=%2Ffavorites");
    }
  }, [authLoading, user, router]);

  const handleFavoriteChange = () => {
    // 찜 목록 새로고침
    refetch();
  };

  // 로딩 상태
  if (authLoading || isLoading) {
    return (
      <div className="mx-auto max-w-5xl xl:max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold">찜한 제품</h1>
          <p className="text-muted-foreground mt-2">불러오는 중...</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // RPC 함수에서 받은 데이터는 이미 올바른 형식
  const products = favorites || [];

  return (
    <div className="mx-auto max-w-5xl xl:max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">찜한 제품</h1>
        <p className="text-muted-foreground mt-2">
          총 <span className="font-semibold text-foreground">{products.length}</span>개의 제품
        </p>
      </div>

      {/* 메인 콘텐츠 */}
      {products.length === 0 ? (
        <EmptyFavorites />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.sku_id}
              product={product}
              onFavoriteChange={handleFavoriteChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
