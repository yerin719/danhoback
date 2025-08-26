"use client";

import NutritionSummary from "@/components/NutritionSummary";
import NutritionTable from "@/components/NutritionTable";
import ProductImageGallery from "@/components/ProductImageGallery";
import ProductInfo from "@/components/ProductInfo";
import RelatedProductThumbnails from "@/components/RelatedProductThumbnails";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/products";
import { ExternalLink, Heart } from "lucide-react";
import { notFound } from "next/navigation";
import { useState } from "react";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    notFound();
  }

  // 같은 브랜드의 다른 제품들 찾기
  const relatedProducts = products.filter((p) => p.brand === product.brand && p.id !== product.id);

  // 이미지 배열 사용 (images가 있으면 사용, 없으면 기본 image 사용)
  const images = product.images || [product.image];

  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(product.favorites);

  const handlePurchase = () => {
    if (product.purchaseUrl) {
      window.open(product.purchaseUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleFavoriteClick = () => {
    setIsFavorited(!isFavorited);
    setFavoriteCount((prev) => (isFavorited ? prev - 1 : prev + 1));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        {/* 왼쪽: 이미지 갤러리 */}
        <div className="lg:col-span-2">
          <ProductImageGallery images={images} alt={product.name} />
        </div>
        <div className="lg:col-span-3 space-y-8">
          {/* 오른쪽: 제품 정보 */}
          {/* 제품 기본 정보 */}
          <ProductInfo product={product} />

          {/* 연관 제품 썸네일 */}
          <RelatedProductThumbnails
            relatedProducts={relatedProducts}
            currentProductId={product.id}
          />

          {/* 영양성분 요약 */}
          <NutritionSummary nutritionFacts={product.nutritionFacts} />

          {/* 찜 버튼과 구매하기 버튼 */}
          <div className="flex gap-3">
            {/* 찜 버튼 */}
            <Button
              variant="outline"
              onClick={handleFavoriteClick}
              className="flex-1 flex items-center justify-center gap-2 py-6 text-xl"
              size="lg"
            >
              <Heart className={`h-6 w-6 ${isFavorited ? "fill-red-500 text-red-500" : ""}`} />
              <span>{favoriteCount}</span>
            </Button>

            {/* 구매하기 버튼 */}
            {product.purchaseUrl && (
              <Button
                onClick={handlePurchase}
                className="flex-[2] flex items-center justify-center gap-3 py-6 text-xl"
                size="lg"
              >
                <ExternalLink className="h-6 w-6" />
                <span>구매하기</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 영양성분표 - 전체 너비 */}
      <div className="mt-12">
        <NutritionTable nutritionFacts={product.nutritionFacts} />
      </div>
    </div>
  );
}
