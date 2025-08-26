"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ProductImage from "@/components/ProductImage";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  brand: string;
  image: string;
  favorites: number;
  protein: number;
  calories: number;
  carbs: number;
  sugar: number;
  flavor: string;
  proteinType: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(product.favorites);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // 카드 클릭과 구분
    setIsFavorited(!isFavorited);
    setFavoriteCount((prev) => (isFavorited ? prev - 1 : prev + 1));
  };

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="h-full cursor-pointer border-none shadow-none">
        <CardHeader className="p-4 pb-2">
          <div className="aspect-square relative mb-4">
            <ProductImage
              src={product.image}
              alt={product.name}
              className="object-cover rounded-lg"
            />
            <Button variant="ghost" size="sm" onClick={handleFavoriteClick} className="absolute bottom-2 right-2 h-8 w-8 p-0">
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

        <CardContent className="px-4 pb-0 pt-0">
          {/* 영양 성분 정보 */}
          <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
            <div className="bg-muted/50 p-2 rounded flex justify-between items-center">
              <span className="text-muted-foreground">단백질</span>
              <p className="font-semibold">{product.protein}g</p>
            </div>
            <div className="bg-muted/50 p-2 rounded flex justify-between items-center">
              <span className="text-muted-foreground">칼로리</span>
              <p className="font-semibold">{product.calories}kcal</p>
            </div>
            <div className="bg-muted/50 p-2 rounded flex justify-between items-center">
              <span className="text-muted-foreground">탄수화물</span>
              <p className="font-semibold">{product.carbs}g</p>
            </div>
            <div className="bg-muted/50 p-2 rounded flex justify-between items-center">
              <span className="text-muted-foreground">당</span>
              <p className="font-semibold">{product.sugar}g</p>
            </div>
          </div>

          {/* 찜 카운트 */}
          <div className="flex items-center justify-start gap-1">
            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
            <span className="text-sm text-red-500">{favoriteCount}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
