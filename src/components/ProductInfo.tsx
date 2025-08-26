"use client";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";

interface Product {
  id: string;
  name: string;
  brand: string;
  favorites: number;
  proteinType: string;
  purchaseUrl?: string;
  totalAmount?: number;
  servingsPerContainer?: number;
}

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className="space-y-6">
      {/* 브랜드 */}
      <div className="flex items-center gap-1">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>{product.brand.charAt(0)}</AvatarFallback>
        </Avatar>
        <span className="font-medium">{product.brand}</span>
      </div>

      {/* 제품명 */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-3">{product.name}</h1>
        {/* 칩들 */}
        <div className="flex gap-2">
          {/* 단백질 종류 칩 */}
          <Badge variant="outline" className="text-sm">
            {product.proteinType}
          </Badge>
          {/* 총 내용량 칩 */}
          {product.totalAmount && (
            <Badge variant="outline" className="text-sm">
              {product.totalAmount}g
            </Badge>
          )}
          {/* 회분 칩 */}
          {product.servingsPerContainer && (
            <Badge variant="outline" className="text-sm">
              {product.servingsPerContainer}회분
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
