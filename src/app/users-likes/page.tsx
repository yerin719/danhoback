"use client";

import EmptyFavorites from "@/components/EmptyFavorites";
// import ProductCard from "@/components/ProductCard";
import UserProfile from "@/components/user/UserProfile";
import { getFavoriteCount, getFavoriteProducts } from "@/lib/favorites";
import { currentUser, isCurrentUser } from "@/lib/user";
import { useState } from "react";

export default function MyPage() {
  const isOwner = isCurrentUser(); // 하드코딩: 현재는 항상 본인
  const [favoriteProducts, setFavoriteProducts] = useState(getFavoriteProducts());
  const [favoriteCount, setFavoriteCount] = useState(getFavoriteCount());

  const handleFavoriteChange = () => {
    setFavoriteProducts(getFavoriteProducts());
    setFavoriteCount(getFavoriteCount());
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* 프로필 영역 */}
      <UserProfile user={currentUser} isOwner={isOwner} />

      {/* 찜 목록 */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-6">찜한 제품</h2>
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            총 <span className="font-semibold text-foreground">{favoriteCount}</span>개의 찜한 제품
          </p>
        </div>

        {favoriteProducts.length === 0 ? (
          <EmptyFavorites />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {/* {favoriteProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                showPurchaseButton={true}
                onFavoriteChange={handleFavoriteChange}
              />
            ))} */}
          </div>
        )}
      </div>
    </div>
  );
}
