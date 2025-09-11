"use client";

import EmptyFavorites from "@/components/EmptyFavorites";
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useFavorites } from "@/features/favorites/hooks";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function FavoritesPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { data: favorites, isLoading, refetch } = useFavorites();

  // 사용자 인증 확인
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/auth/login");
      } else {
        setIsAuthenticated(true);
      }
    });
  }, [router]);

  const handleFavoriteChange = () => {
    // 찜 목록 새로고침
    refetch();
  };

  // 로딩 상태
  if (!isAuthenticated || isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">찜한 제품</h1>
          <p className="text-muted-foreground mt-2">불러오는 중...</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">찜한 제품</h1>
        <p className="text-muted-foreground mt-2">
          총 <span className="font-semibold text-foreground">{products.length}</span>개의 제품
        </p>
      </div>

      {/* 메인 콘텐츠 */}
      {products.length === 0 ? (
        <EmptyFavorites />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.variant_id}
              product={product}
              showPurchaseButton={true}
              onFavoriteChange={handleFavoriteChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}