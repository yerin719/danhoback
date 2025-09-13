"use client";

import NutritionSummary from "@/components/NutritionSummary";
import NutritionTable from "@/components/NutritionTable";
import ProductImageGallery from "@/components/ProductImageGallery";
import ProductInfo from "@/components/ProductInfo";
import RelatedProductThumbnails from "@/components/RelatedProductThumbnails";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useToggleFavorite } from "@/features/favorites/hooks";
import { useProductDetail } from "@/features/products/hooks/useProductDetail";
import { ExternalLink, Heart } from "lucide-react";
import { notFound, useRouter } from "next/navigation";

interface ProductDetailClientProps {
  slug: string;
}

export default function ProductDetailClient({ slug }: ProductDetailClientProps) {
  const { data: productData, isLoading, error, refetch } = useProductDetail(slug);
  const { user } = useAuth();
  const router = useRouter();
  const toggleFavorite = useToggleFavorite(user?.id || "");

  const handleFavoriteClick = async () => {
    if (!user) {
      // 현재 페이지 URL을 저장하여 로그인 후 돌아올 수 있도록 함
      router.push(`/auth/login?redirectedFrom=/products/${slug}`);
      return;
    }

    // DB 업데이트
    toggleFavorite.mutate(
      { 
        productVariantId: productData?.selected_variant.id || "", 
        currentStatus: productData?.is_favorited || false 
      },
      {
        onSuccess: () => {
          // 성공시 데이터 새로고침
          refetch();
        }
      }
    );
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <Skeleton className="aspect-square w-full" />
          </div>
          <div className="lg:col-span-3 space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-6 w-3/4" />
            </div>
            <div className="flex gap-4">
              <Skeleton className="h-24 w-24" />
              <Skeleton className="h-24 w-24" />
              <Skeleton className="h-24 w-24" />
            </div>
            <Skeleton className="h-32 w-full" />
            <div className="flex gap-3">
              <Skeleton className="h-14 flex-1" />
              <Skeleton className="h-14 flex-[2]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !productData) {
    notFound();
  }

  // 새로운 데이터 구조에서 정보 추출
  const selectedVariant = productData.selected_variant;
  const productInfo = productData.product_info;
  const brandInfo = productData.brand_info;
  const relatedVariants = productData.related_variants || [];

  if (!selectedVariant) {
    return <div>제품 정보를 찾을 수 없습니다.</div>;
  }

  // 이미지 배열 준비 - Json 타입을 안전하게 변환
  const images: (string | { url: string })[] = (() => {
    // selectedVariant.images가 Json 타입이므로 타입 가드 필요
    const variantImages = selectedVariant.images;

    if (Array.isArray(variantImages)) {
      return variantImages.filter(
        (img): img is string | { url: string } =>
          typeof img === "string" || (img !== null && typeof img === "object" && "url" in img),
      );
    }

    // images가 없으면 primary_image 사용
    return selectedVariant.primary_image ? [selectedVariant.primary_image] : [];
  })();


  const handlePurchase = () => {
    if (selectedVariant.purchase_url) {
      window.open(selectedVariant.purchase_url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        {/* 왼쪽: 이미지 갤러리 */}
        <div className="lg:col-span-2">
          <ProductImageGallery images={images} alt={selectedVariant.name || productInfo.name} />
        </div>
        <div className="lg:col-span-3 space-y-8">
          {/* 오른쪽: 제품 정보 */}
          {/* 제품 기본 정보 */}
          <ProductInfo productInfo={productInfo} brandInfo={brandInfo} variant={selectedVariant} />

          {/* 연관 제품 썸네일 (다른 variants) */}
          {relatedVariants.length > 0 && (
            <RelatedProductThumbnails
              variants={relatedVariants}
              currentVariantId={selectedVariant.id}
            />
          )}

          {/* 영양성분 요약 */}
          {selectedVariant.nutrition && <NutritionSummary nutrition={selectedVariant.nutrition} />}

          {/* 찜 버튼과 구매하기 버튼 */}
          <div className="flex gap-3">
            {/* 찜 버튼 */}
            <Button
              variant="outline"
              onClick={handleFavoriteClick}
              className="flex-1 flex items-center justify-center gap-2 py-6 text-xl"
              size="lg"
              disabled={toggleFavorite.isPending}
            >
              <Heart className={`h-6 w-6 ${productData.is_favorited ? "fill-red-500 text-red-500" : ""}`} />
              <span>{selectedVariant.favorites_count || 0}</span>
            </Button>

            {/* 구매하기 버튼 */}
            {selectedVariant.purchase_url && (
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
      {selectedVariant.nutrition && (
        <div className="mt-12">
          <NutritionTable nutrition={selectedVariant.nutrition} />
        </div>
      )}
    </div>
  );
}