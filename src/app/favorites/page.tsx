"use client";

import EmptyFavorites from "@/components/EmptyFavorites";
import ProductCard from "@/components/ProductCard";
import { getFavoriteCount, getFavoriteProducts } from "@/lib/favorites";
import { useState } from "react";

export default function FavoritesPage() {
  const [favoriteProducts, setFavoriteProducts] = useState(getFavoriteProducts());
  const [favoriteCount, setFavoriteCount] = useState(getFavoriteCount());

  const handleFavoriteChange = () => {
    // 찜 목록 업데이트
    setFavoriteProducts(getFavoriteProducts());
    setFavoriteCount(getFavoriteCount());
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">찜한 제품</h1>
        <p className="text-muted-foreground mt-2">
          총 <span className="font-semibold text-foreground">{favoriteCount}</span>개의 제품
        </p>
      </div>

      {/* 메인 콘텐츠 */}
      {favoriteProducts.length === 0 ? (
        <EmptyFavorites />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {favoriteProducts.map((product) => (
            <ProductCard
              key={product.id}
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