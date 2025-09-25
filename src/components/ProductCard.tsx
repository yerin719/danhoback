"use client";

import ProductImage from "@/components/ProductImage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToggleFavorite } from "@/features/favorites/hooks";
import { ExternalLink, Heart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Product {
  sku_id: string;
  product_id: string;
  product_name: string;
  sku_name: string;
  slug: string;
  brand_name: string;
  brand_name_en?: string;
  brand_logo_url?: string;
  brand_id: string;
  primary_image?: string;
  favorites_count: number;
  is_favorited?: boolean;
  flavor_name?: string;
  flavor_category?: string;
  protein_types?: string[];
  form: string;
  package_type?: string;
  size?: string;
  purchase_url?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  sugar?: number;
}

interface ProductCardProps {
  product: Product;
  showPurchaseButton?: boolean;
  onFavoriteChange?: () => void;
}

export default function ProductCard({
  product,
  showPurchaseButton = false,
  onFavoriteChange,
}: ProductCardProps) {
  const { user } = useAuth();
  const router = useRouter();
  const toggleFavorite = useToggleFavorite(user?.id || "");

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // 카드 클릭과 구분

    if (!user) {
      // 로그인 페이지로 리다이렉트
      router.push(`/auth/login?redirectedFrom=/products/${product.slug}`);
      return;
    }

    // sku_id가 없으면 에러 처리
    if (!product.sku_id) {
      console.error("Product sku_id is missing:", product);
      return;
    }

    // 찜 토글 mutation 실행 (현재 상태 전달)
    toggleFavorite.mutate({
      productSkuId: product.sku_id,
      currentStatus: !!product.is_favorited,
    });

    // 찜 해제시 부모 컴포넌트에 알림
    if (product.is_favorited && onFavoriteChange) {
      onFavoriteChange();
    }
  };

  const handlePurchaseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.purchase_url) {
      window.open(product.purchase_url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Link href={`/products/${product.slug}`}>
      <Card className="h-full cursor-pointer border-none shadow-none p-0">
        <CardHeader className="py-4 px-0 pb-2">
          <div className="aspect-square relative mb-4">
            <ProductImage
              src={product.primary_image || "/placeholder.png"}
              alt={product.sku_name || product.product_name}
              className="object-cover rounded-lg"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFavoriteClick}
              className="absolute bottom-2 right-2 h-8 w-8 p-0"
              disabled={toggleFavorite.isPending}
            >
              <Heart
                className={`h-4 w-4 ${
                  product.is_favorited ? "fill-red-500 text-red-500" : "text-muted-foreground"
                }`}
              />
            </Button>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{product.brand_name}</p>
            <h3 className="font-semibold text-sm leading-tight">
              {product.sku_name || product.product_name}
            </h3>
          </div>
        </CardHeader>

        <CardContent className="px-0 py-0">
          {/* 영양 성분 정보 */}
          <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
            {product.protein !== null && product.protein !== undefined && (
              <div className="bg-muted/50 p-2 rounded flex justify-between items-center">
                <span className="text-muted-foreground">단백질</span>
                <p className="font-semibold">{product.protein}g</p>
              </div>
            )}
            {product.calories !== null && product.calories !== undefined && (
              <div className="bg-muted/50 p-2 rounded flex justify-between items-center">
                <span className="text-muted-foreground">칼로리</span>
                <p className="font-semibold">{product.calories}kcal</p>
              </div>
            )}
            {product.carbs !== null && product.carbs !== undefined && (
              <div className="bg-muted/50 p-2 rounded flex justify-between items-center">
                <span className="text-muted-foreground">탄수화물</span>
                <p className="font-semibold">{product.carbs}g</p>
              </div>
            )}
            {product.sugar !== null && product.sugar !== undefined && (
              <div className="bg-muted/50 p-2 rounded flex justify-between items-center">
                <span className="text-muted-foreground">당</span>
                <p className="font-semibold">{product.sugar}g</p>
              </div>
            )}
          </div>

          {/* 찜 카운트 */}
          <div
            className={`flex items-center justify-start gap-1 ${showPurchaseButton ? "mb-4" : ""}`}
          >
            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
            <span className="text-sm text-red-500">{product.favorites_count}</span>
          </div>

          {/* 구매하기 버튼 */}
          {showPurchaseButton && product.purchase_url && (
            <Button
              onClick={handlePurchaseClick}
              className="w-full flex items-center gap-2"
              size="sm"
            >
              <ExternalLink className="h-4 w-4" />
              최저가 확인하러 가기
            </Button>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
