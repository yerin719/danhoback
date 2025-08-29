"use client";

import ProductImage from "@/components/ProductImage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ExternalLink, Heart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  brand: string;
  image: string;
  favorites: number;
  flavor: string;
  proteinType: string;
  purchaseUrl?: string;
  nutritionFacts: {
    servingSize: number;
    calories: number;
    carbs: number;
    sugar: number;
    protein: number;
    fat?: number;
  };
}

interface ProductCardProps {
  product: Product;
  showPurchaseButton?: boolean;
  onFavoriteChange?: () => void;
}

export default function ProductCard({ 
  product, 
  showPurchaseButton = false, 
  onFavoriteChange 
}: ProductCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(product.favorites);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // 카드 클릭과 구분
    setIsFavorited(!isFavorited);
    setFavoriteCount((prev) => (isFavorited ? prev - 1 : prev + 1));
    
    // 찜 해제시 부모 컴포넌트에 알림
    if (isFavorited && onFavoriteChange) {
      onFavoriteChange();
    }
  };

  const handlePurchaseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.purchaseUrl) {
      window.open(product.purchaseUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="h-full cursor-pointer border-none shadow-none p-0">
        <CardHeader className="py-4 px-0 pb-2">
          <div className="aspect-square relative mb-4">
            <ProductImage
              src={product.image}
              alt={product.name}
              className="object-cover rounded-lg"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFavoriteClick}
              className="absolute bottom-2 right-2 h-8 w-8 p-0"
            >
              <Heart
                className={`h-4 w-4 ${
                  isFavorited ? "fill-red-500 text-red-500" : "text-muted-foreground"
                }`}
              />
            </Button>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{product.brand}</p>
            <h3 className="font-semibold text-sm leading-tight">{product.name}</h3>
          </div>
        </CardHeader>

        <CardContent className="px-0 py-0">
          {/* 영양 성분 정보 */}
          <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
            <div className="bg-muted/50 p-2 rounded flex justify-between items-center">
              <span className="text-muted-foreground">단백질</span>
              <p className="font-semibold">{product.nutritionFacts.protein}g</p>
            </div>
            <div className="bg-muted/50 p-2 rounded flex justify-between items-center">
              <span className="text-muted-foreground">칼로리</span>
              <p className="font-semibold">{product.nutritionFacts.calories}kcal</p>
            </div>
            <div className="bg-muted/50 p-2 rounded flex justify-between items-center">
              <span className="text-muted-foreground">탄수화물</span>
              <p className="font-semibold">{product.nutritionFacts.carbs}g</p>
            </div>
            <div className="bg-muted/50 p-2 rounded flex justify-between items-center">
              <span className="text-muted-foreground">당</span>
              <p className="font-semibold">{product.nutritionFacts.sugar}g</p>
            </div>
          </div>

          {/* 찜 카운트 */}
          <div className={`flex items-center justify-start gap-1 ${showPurchaseButton ? 'mb-4' : ''}`}>
            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
            <span className="text-sm text-red-500">{favoriteCount}</span>
          </div>

          {/* 구매하기 버튼 */}
          {showPurchaseButton && product.purchaseUrl && (
            <Button
              onClick={handlePurchaseClick}
              className="w-full flex items-center gap-2"
              size="sm"
            >
              <ExternalLink className="h-4 w-4" />
              구매하기
            </Button>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
